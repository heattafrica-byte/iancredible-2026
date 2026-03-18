
import React, { useState, useCallback, useEffect } from 'react';
import { AppState, MixdownResult, TrackStates, LinkGroup, EQPreset, EQBand, EQSettings, FXSettings, AutomationPoint, Project } from './types';
import { generateMixdownInsights, generateFXInsights, generateMasteringAdvice } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ProcessingView from './components/ProcessingView';
import ResultsView from './components/ResultsView';
import { Header } from './components/Header';
import { ErrorDisplay } from './components/ErrorDisplay';
import { renderMixdown } from './services/dspService';
import { analyzeAudioBuffer, AudioAnalysisResult } from './utils/audioAnalysis';
import LinkManagerModal from './components/LinkManagerModal';
import ProjectsModal from './components/ProjectsModal';
import { useStartupSound } from './hooks/useStartupSound';
import { decodeAudioFiles } from './services/audioService';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { saveProjectToCloud, loadProjectFiles, CloudProject } from './services/cloudStorageService';

const App: React.FC = () => {
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  
  // Hardcode Pro status for the owner
  const [isPro, setIsPro] = useState(false);
  
  const [showApp, setShowApp] = useState(false);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [files, setFiles] = useState<File[]>([]);
  const [mixdownResults, setMixdownResults] = useState<MixdownResult[]>([]);
  const [error, setError] = useState<Error | string | null>(null);
  const [genre, setGenre] = useState<string>('');
  const [sampleRate, setSampleRate] = useState<number>(44100);
  const [masteringAdvice, setMasteringAdvice] = useState<string | null>(null);
  const [isMasteringAssistantLoading, setIsMasteringAssistantLoading] = useState<boolean>(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [trackStates, setTrackStates] = useState<TrackStates>({});
  const [links, setLinks] = useState<LinkGroup[]>([]);
  const [linkingTrackName, setLinkingTrackName] = useState<string | null>(null);
  const [eqPresets, setEqPresets] = useState<EQPreset[]>([]);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  
  const [history, setHistory] = useState<MixdownResult[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const [audioBuffers, setAudioBuffers] = useState<Map<string, AudioBuffer> | null>(null);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [bufferingProgress, setBufferingProgress] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<AudioAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const { playSound } = useStartupSound();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment') === 'success') {
      setIsPro(true);
      alert('Payment successful! You are now an IntelliMix AI Pro user.');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (query.get('payment') === 'cancel') {
      alert('Payment was canceled.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ uid: currentUser.uid, email: currentUser.email });
        setShowApp(true);
        if (currentUser.email === 'iancrediblemusic@gmail.com') {
          setIsPro(true);
        }
      } else {
        setUser(null);
        setShowApp(false);
        setIsPro(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    playSound();
  }, [playSound]);

  useEffect(() => {
    try {
        const storedPresets = localStorage.getItem('intellimix-eq-presets');
        if (storedPresets) {
            setEqPresets(JSON.parse(storedPresets));
        }
    } catch (e) {
        console.error("Failed to load EQ presets from localStorage", e);
    }
  }, []);
  
  useEffect(() => {
    const currentStateInHistory = history[historyIndex];
    if (currentStateInHistory && currentStateInHistory !== mixdownResults) {
        setMixdownResults(currentStateInHistory);
    }
  }, [history, historyIndex, mixdownResults]);

  useEffect(() => {
    if (files.length > 0 && !audioBuffers) {
        const bufferFiles = async () => {
            setIsBuffering(true);
            setBufferingProgress(0);
            setError(null);
            try {
                const decoded = await decodeAudioFiles(files, (progress) => {
                    setBufferingProgress(progress);
                });
                setAudioBuffers(decoded);
            } catch (e) {
                console.error("Failed to buffer audio files", e);
                setError("Could not decode audio files. Check format or corruption.");
            } finally {
                setIsBuffering(false);
            }
        };
        bufferFiles();
    }
  }, [files]);

  const savePresetsToStorage = (presets: EQPreset[]) => {
      try {
          localStorage.setItem('intellimix-eq-presets', JSON.stringify(presets));
      } catch (e) {
          console.error("Failed to save EQ presets to localStorage", e);
      }
  };
  
  const updateResultsAndHistory = (newResults: MixdownResult[] | ((prev: MixdownResult[]) => MixdownResult[])) => {
    const resolvedNewResults = typeof newResults === 'function' ? newResults(mixdownResults) : newResults;
    setMixdownResults(resolvedNewResults);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, resolvedNewResults]);
    setHistoryIndex(newHistory.length);
  };

  const handleSaveEqPreset = (trackName: string, presetName: string) => {
    const trackResult = mixdownResults.find(r => r.trackName === trackName);
    if (!trackResult || !presetName) return;
    const newPreset: EQPreset = {
        name: presetName,
        bands: trackResult.eq.bands,
    };
    const updatedPresets = [...eqPresets.filter(p => p.name !== presetName), newPreset];
    setEqPresets(updatedPresets);
    savePresetsToStorage(updatedPresets);
  };

  const handleApplyEqPreset = (trackName: string, eqSettings: EQSettings) => {
    updateResultsAndHistory(prevResults =>
        prevResults.map(result =>
            result.trackName === trackName ? { ...result, eq: eqSettings } : result
        )
    );
  };

  const handleDeleteEqPreset = (presetName: string) => {
    const updatedPresets = eqPresets.filter(p => p.name !== presetName);
    setEqPresets(updatedPresets);
    savePresetsToStorage(updatedPresets);
  };

  const handleEqChange = (trackName: string, bandIndex: number, updatedBand: EQBand) => {
    updateResultsAndHistory(prevResults =>
        prevResults.map(result => {
            if (result.trackName === trackName) {
                const newBands = [...result.eq.bands];
                newBands[bandIndex] = updatedBand;
                return { ...result, eq: { ...result.eq, bands: newBands } };
            }
            return result;
        })
    );
  };
  
  const handleFxChange = (trackName: string, fxType: keyof FXSettings, param: string, value: number) => {
    updateResultsAndHistory(prevResults =>
        prevResults.map(result => {
            if (result.trackName === trackName && result.fx) {
                const newFx = JSON.parse(JSON.stringify(result.fx));
                if (newFx[fxType]) {
                    (newFx[fxType] as any)[param] = value;
                }
                return { ...result, fx: newFx };
            }
            return result;
        })
    );
  };

  const handleAutomationChange = (trackName: string, type: 'volume' | 'pan', newPoints: AutomationPoint[]) => {
    updateResultsAndHistory(prevResults =>
        prevResults.map(result => {
            if (result.trackName === trackName) {
                const updatedAutomation = { ...result.automation };
                if (type === 'volume') {
                    updatedAutomation.clipGain = newPoints;
                } else if (type === 'pan') {
                    updatedAutomation.pan = newPoints;
                }
                return {
                    ...result,
                    automation: updatedAutomation,
                };
            }
            return result;
        })
    );
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    const fileMap = new Map(files.map(f => [f.name, f]));
    selectedFiles.forEach(f => {
        fileMap.set(f.name, f);
    });
    const combinedFiles = Array.from(fileMap.values());
    setFiles(combinedFiles);
    setAppState(AppState.FILES_UPLOADED);
    setError(null);
    setMixdownResults([]);
    setLinks([]);
    setAudioBuffers(null);
    const newTrackStates: TrackStates = {};
    combinedFiles.forEach((file: File) => {
        newTrackStates[file.name] = trackStates[file.name] || { isMuted: false, isSoloed: false };
    });
    setTrackStates(newTrackStates);
    setHistory([]);
    setHistoryIndex(0);
  };

  const resetApp = () => {
    setFiles([]);
    setMixdownResults([]);
    setError(null);
    setAppState(AppState.IDLE);
    setGenre('');
    setMasteringAdvice(null);
    setTrackStates({});
    setLinks([]);
    setLinkingTrackName(null);
    setHistory([]);
    setHistoryIndex(0);
    setAudioBuffers(null);
    setIsBuffering(false);
    setBufferingProgress(0);
    setAnalysisResult(null);
  };

  const handleToggleMute = (trackName: string) => {
    setTrackStates(prevStates => ({
      ...prevStates,
      [trackName]: { ...prevStates[trackName], isMuted: !prevStates[trackName].isMuted }
    }));
  };
  
  const handleToggleSolo = (trackName: string) => {
    const isCurrentlySoloed = trackStates[trackName]?.isSoloed;
    setTrackStates(prevStates => {
      const newStates = { ...prevStates };
      Object.keys(newStates).forEach(key => {
        newStates[key] = { ...newStates[key], isSoloed: false };
      });
      if (!isCurrentlySoloed) {
        newStates[trackName] = { ...newStates[trackName], isSoloed: true };
      }
      return newStates;
    });
  };

  const handleInputGainChange = (trackName: string, gainDb: number) => {
    const linkGroup = links.find(group => group.includes(trackName));
    const tracksToUpdate = linkGroup ? new Set(linkGroup) : new Set([trackName]);
    updateResultsAndHistory(prevResults => 
        prevResults.map(result => 
            tracksToUpdate.has(result.trackName)
                ? { ...result, volume: { ...result.volume, inputGainDb: gainDb } }
                : result
        )
    );
  };

  const handleStartLinking = (trackName: string) => {
    setLinkingTrackName(trackName);
  };

  const handleCloseLinkManager = () => {
    setLinkingTrackName(null);
  };

  const handleUpdateLinks = (newLinks: LinkGroup[]) => {
    setLinks(newLinks);
  };

  const handleStartMixdown = useCallback(async () => {
    if (files.length === 0) {
      setError("Please select one or more audio files to begin.");
      return;
    }
    setAppState(AppState.PROCESSING_STAGE1);
    setError(null);
    try {
      const trackNames = files.map(f => f.name);
      const results = await generateMixdownInsights(trackNames, genre, eqPresets);
      const resultsWithDefaults = results.map(r => ({
          ...r,
          volume: {
              ...r.volume,
              inputGainDb: r.volume.inputGainDb ?? 0,
          }
      }));
      setMixdownResults(resultsWithDefaults);
      setHistory([resultsWithDefaults]);
      setHistoryIndex(0);
      setAppState(AppState.RESULTS_STAGE1);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Mixdown analysis failed.");
      setAppState(AppState.FILES_UPLOADED);
    }
  }, [files, genre, eqPresets]);

  const handleAddFX = useCallback(async () => {
    setAppState(AppState.PROCESSING_STAGE2);
    setError(null);
    try {
      const updatedResults = await generateFXInsights(mixdownResults, genre);
      updateResultsAndHistory(updatedResults);
      setAppState(AppState.RESULTS_STAGE2);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "FX generation failed.");
      setAppState(AppState.RESULTS_STAGE1);
    }
  }, [mixdownResults, genre]);

  const handleGetMasteringAdvice = useCallback(async () => {
    setIsMasteringAssistantLoading(true);
    setError(null);
    try {
        const advice = await generateMasteringAdvice(mixdownResults, genre);
        setMasteringAdvice(advice);
    } catch (e: any) {
        console.error(e);
        setError(e.message || "Mastering Assistant failed.");
    } finally {
        setIsMasteringAssistantLoading(false);
    }
  }, [mixdownResults, genre]);
  
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
        setHistoryIndex(prevIndex => prevIndex - 1);
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
        setHistoryIndex(prevIndex => prevIndex + 1);
    }
  }, [historyIndex, history.length]);

  const handleExportInsights = () => {
    let content = `IntelliMix AI Report\n\nGenre: ${genre || 'Unspecified'}\n\n`;
    mixdownResults.forEach(track => {
      content += `TRACK: ${track.trackName}\n`;
      content += `  - Level: ${track.volume.leveldB} dB\n`;
      content += `  - Pan: ${track.panning.position}\n`;
      content += `  - Compression: ${track.compression.ratio}:1\n`;
      content += `  - EQ: ${track.eq.bands.length} bands\n\n`;
    });
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'IntelliMix_Report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportWav = async () => {
    setExportStatus('Rendering WAV...');
    setError(null);
    try {
        const blob = await renderMixdown(files, mixdownResults, sampleRate, trackStates);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'IntelliMix_Output_24bit_48kHz.wav';
        a.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error(e);
        setError("Audio rendering failed.");
    } finally {
        setExportStatus(null);
    }
  };

  const [applyMastering, setApplyMastering] = useState<boolean>(true);

  const handleExportFlac = async () => {
    setExportStatus('Rendering Mixdown...');
    setError(null);
    try {
        // 1. Render the 24-bit WAV locally
        const wavBlob = await renderMixdown(files, mixdownResults, sampleRate, trackStates);
        
        // 2. Send to backend for FLAC encoding in chunks
        const uploadId = Date.now().toString() + Math.random().toString(36).substring(7);
        const chunkSize = 5 * 1024 * 1024; // 5MB chunks
        const totalChunks = Math.ceil(wavBlob.size / chunkSize);

        for (let i = 0; i < totalChunks; i++) {
            setExportStatus(`Uploading to Server (${Math.round((i/totalChunks)*100)}%)...`);
            const chunk = wavBlob.slice(i * chunkSize, (i + 1) * chunkSize);
            const formData = new FormData();
            formData.append('chunk', chunk, 'chunk.wav');
            formData.append('uploadId', uploadId);
            formData.append('chunkIndex', i.toString());

            const chunkResponse = await fetch('/api/upload-chunk', {
                method: 'POST',
                body: formData,
            });

            if (!chunkResponse.ok) {
                throw new Error(`Failed to upload chunk ${i + 1}/${totalChunks}`);
            }
        }

        // 3. Trigger final encoding
        setExportStatus(applyMastering ? 'Mastering with Auphonic AI (this takes a minute)...' : 'Encoding FLAC...');
        const finalFilename = applyMastering ? 'IntelliMix_Mastered_24bit_48kHz.flac' : 'IntelliMix_Mixdown_24bit_48kHz.flac';
        const encodeResponse = await fetch('/api/encode-flac-chunked', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uploadId,
                totalChunks,
                filename: finalFilename,
                applyMastering: applyMastering.toString()
            }),
        });

        if (!encodeResponse.ok) {
            throw new Error('Failed to encode FLAC on server');
        }

        // 4. Download the resulting FLAC file
        setExportStatus('Downloading...');
        const flacBlob = await encodeResponse.blob();
        const url = URL.createObjectURL(flacBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = finalFilename;
        a.click();
        URL.revokeObjectURL(url);
    } catch (e: any) {
        console.error(e);
        setError("FLAC encoding failed: " + e.message);
    } finally {
        setExportStatus(null);
    }
  };

  const handleAnalyzeMaster = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
        const wavBlob = await renderMixdown(files, mixdownResults, sampleRate, trackStates);
        const arrayBuffer = await wavBlob.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const result = await analyzeAudioBuffer(audioBuffer);
        setAnalysisResult(result);
        audioContext.close();
    } catch (e: any) {
        console.error(e);
        setError("Master analysis failed: " + e.message);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleSaveProject = async () => {
      const projectName = prompt("Project Name:");
      if (!projectName?.trim()) return;
      
      if (!user) {
          alert("You must be logged in to save projects to the cloud.");
          setIsAuthModalOpen(true);
          return;
      }

      setExportStatus('Saving Project...');
      try {
          const projectData: Omit<Project, 'id' | 'createdAt'> = {
              name: projectName,
              genre,
              appState,
              trackNames: files.map(f => f.name),
              mixdownResults,
              trackStates,
              links
          };
          
          await saveProjectToCloud(projectData, files, (progress) => {
              // We could use a separate progress state, but for now just console log
              console.log(`Uploading: ${Math.round(progress)}%`);
          });
          
          alert(`Project "${projectName}" saved to cloud!`);
      } catch (err: any) {
          console.error("Failed to save project", err);
          alert("Failed to save project: " + err.message);
      } finally {
          setExportStatus(null);
      }
  };

  const handleLoadProject = async (project: CloudProject) => {
      setExportStatus('Loading Project...');
      try {
          // Load audio files from cloud storage
          const downloadedFiles = await loadProjectFiles(project, (progress) => {
              console.log(`Downloading: ${Math.round(progress)}%`);
          });
          
          setFiles(downloadedFiles);
          setGenre(project.genre);
          setMixdownResults(project.mixdownResults);
          setTrackStates(project.trackStates);
          setLinks(project.links);
          setAppState(project.appState);
          setHistory([project.mixdownResults]);
          setHistoryIndex(0);
          setIsProjectsModalOpen(false);
          alert(`Project "${project.name}" loaded successfully!`);
      } catch (err: any) {
          console.error("Failed to load project files", err);
          alert("Failed to load project audio files: " + err.message);
      } finally {
          setExportStatus(null);
      }
  };
  
  const handleDeleteProject = async (projectId: string) => {
    // Deletion is handled directly in ProjectsModal via cloudStorageService
  };

  const handleUpgrade = async (plan: string) => {
    if (!user) return;
    try {
        // 1. Create a checkout session on the server
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.uid,
                userEmail: user.email,
            }),
        });

        const session = await response.json();

        if (session.url) {
            // 2. Redirect to Stripe Checkout
            window.location.href = session.url;
        } else {
            throw new Error(session.error || 'Failed to create checkout session');
        }
    } catch (e: any) {
        console.error("Upgrade failed", e);
        alert(`Upgrade failed: ${e.message}. (Make sure STRIPE_SECRET_KEY is set in environment)`);
        
        // Fallback for demo purposes
        if (confirm("Stripe is not configured. Would you like to simulate a successful payment for testing?")) {
            alert("In a real app, this would update your subscription status. For now, we've enabled Pro features.");
            setIsSubscriptionModalOpen(false);
        }
    }
  };

  if (!showApp && !user) {
    return (
      <>
        <LandingPage onGetStarted={() => setIsAuthModalOpen(true)} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-300 font-mono p-4 sm:p-8 flex flex-col items-center">
        <Header 
            onReset={resetApp} 
            showReset={appState !== AppState.IDLE}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onOpenProjects={() => setIsProjectsModalOpen(true)}
            user={user}
            onSignOut={() => {
                signOut(auth);
            }}
            isPro={isPro}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        />
        <main className="w-full max-w-7xl mt-8">
            {error && <ErrorDisplay error={error} />}
            {appState === AppState.IDLE ? (
              <FileUpload onFilesSelected={handleFilesSelected} />
            ) : appState === AppState.FILES_UPLOADED ? (
              <FileUpload 
                  files={files} 
                  onFilesSelected={handleFilesSelected} 
                  onStartMixdown={handleStartMixdown}
                  genre={genre}
                  onGenreChange={setGenre}
                  isBuffering={isBuffering}
                  bufferingProgress={bufferingProgress}
              />
            ) : (appState === AppState.PROCESSING_STAGE1 || appState === AppState.PROCESSING_STAGE2) ? (
              <ProcessingView message={appState === AppState.PROCESSING_STAGE1 ? "Analyzing Stems..." : "Applying Creative FX..."} />
            ) : (
              <ResultsView 
                  results={mixdownResults}
                  appState={appState}
                  audioBuffers={audioBuffers}
                  onAddFX={handleAddFX}
                  onExportInsights={handleExportInsights}
                  onExportWav={handleExportWav}
                  onExportFlac={handleExportFlac}
                  onSaveProject={handleSaveProject}
                  exportStatus={exportStatus}
                  sampleRate={sampleRate}
                  onSampleRateChange={setSampleRate}
                  onGetMasteringAdvice={handleGetMasteringAdvice}
                  isMasteringAssistantLoading={isMasteringAssistantLoading}
                  masteringAdvice={masteringAdvice}
                  onClearMasteringAdvice={() => setMasteringAdvice(null)}
                  onAnalyzeMaster={handleAnalyzeMaster}
                  analysisResult={analysisResult}
                  isAnalyzing={isAnalyzing}
                  trackStates={trackStates}
                  onToggleMute={handleToggleMute}
                  onToggleSolo={handleToggleSolo}
                  onInputGainChange={handleInputGainChange}
                  links={links}
                  onStartLinking={handleStartLinking}
                  eqPresets={eqPresets}
                  onSaveEqPreset={handleSaveEqPreset}
                  onApplyEqPreset={handleApplyEqPreset}
                  onDeleteEqPreset={handleDeleteEqPreset}
                  onEqChange={handleEqChange}
                  onFxChange={handleFxChange}
                  onAutomationChange={handleAutomationChange}
                  genre={genre}
                  isPro={isPro}
                  onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
                  applyMastering={applyMastering}
                  onToggleMastering={() => setApplyMastering(!applyMastering)}
              />
            )}
        </main>
        {linkingTrackName && (
          <LinkManagerModal
            isOpen={!!linkingTrackName}
            onClose={handleCloseLinkManager}
            onSave={handleUpdateLinks}
            allTracks={mixdownResults}
            sourceTrackName={linkingTrackName}
            links={links}
          />
        )}
        <ProjectsModal
            isOpen={isProjectsModalOpen}
            onClose={() => setIsProjectsModalOpen(false)}
            onLoadProject={handleLoadProject}
            onDeleteProject={handleDeleteProject}
        />
        <SubscriptionModal 
            isOpen={isSubscriptionModalOpen} 
            onClose={() => setIsSubscriptionModalOpen(false)} 
            onUpgrade={handleUpgrade}
        />
    </div>
  );
};

export default App;

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import { motion } from 'framer-motion';
import { Users, MessageCircle, Edit3, Save, Share2, Play, Mic, MicOff } from 'lucide-react';
import api from '../utils/api';
import InviteModal from '../components/pitch-deck/InviteModal';
import SlideThumbnails from '../components/pitch-deck/SlideThumbnails';
import PageBackground from '../components/ui/PageBackground';interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  slideIndex: number;
  position: { x: number; y: number };
  createdAt: string;
}

interface Collaborator {
  userId: string;
  userName: string;
  email: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
}

const CollaborativePitchDeck = () => {
  const { id } = useParams();
  const { user, token } = useSelector((state: RootState) => state.auth);
  
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [talkingPoints, setTalkingPoints] = useState<string[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    // Load pitch deck data
    const loadPitchDeck = async () => {
      try {
        const response = await api.get(`/api/idea/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const idea = response.data;
        if (idea.pitchDeckContent) {
          const slideData = [
            { title: 'Problem', content: idea.pitchDeckContent.problem },
            { title: 'Solution', content: idea.pitchDeckContent.solution },
            { title: 'Market Size', content: idea.pitchDeckContent.marketSize },
            { title: 'Business Model', content: idea.pitchDeckContent.businessModel },
            { title: 'Competition', content: idea.pitchDeckContent.competitors },
            { title: 'Go-to-Market Strategy', content: idea.pitchDeckContent.goToMarket },
            { title: 'Team', content: idea.pitchDeckContent.team },
            { title: 'Financials', content: idea.pitchDeckContent.financials },
            { title: 'Milestones', content: idea.pitchDeckContent.milestones },
            { title: 'Ask & Use of Funds', content: idea.pitchDeckContent.askAndUse }
          ];
          setSlides(slideData);
          
          // Load existing comments and talking points
          if (idea.collaborativeData) {
            setComments(idea.collaborativeData.comments || []);
            const currentSlideTalkingPoints = idea.collaborativeData.talkingPoints?.find(
              tp => tp.slideIndex === currentSlide
            );
            if (currentSlideTalkingPoints) {
              setTalkingPoints(currentSlideTalkingPoints.points || []);
            }
          }
        }
      } catch (error) { if (import.meta.env.DEV) console.error('Failed to load pitch deck:', error);
      }
    };

    loadPitchDeck();
  }, [id, token]);
  useEffect(() => {
    // Initialize WebSocket for real-time collaboration
    const ws = new WebSocket(`ws://localhost:5000/collaborate/${id}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'collaborator_joined':
          setCollaborators(prev => [...prev, data.collaborator]);
          break;
        case 'collaborator_left':
          setCollaborators(prev => prev.filter(c => c.userId !== data.userId));
          break;
        case 'slide_updated':
          setSlides(prev => prev.map((slide, index) => 
            index === data.slideIndex ? { ...slide, content: data.content } : slide
          ));
          break;
        case 'comment_added':
          setComments(prev => [...prev, data.comment]);
          break;
        case 'cursor_moved':
          setCollaborators(prev => prev.map(c => 
            c.userId === data.userId ? { ...c, cursor: data.position } : c
          ));
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, [id]);

  const handleSlideEdit = async (slideIndex: number, content: string) => {
    setSaveLoading(true);
    try {
      await api.put(`/api/pitchdeck/collaborative/${id}/slide`, {
        slideIndex,
        content,
        slideTitle: slides[slideIndex]?.title
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
    setSlides(prev => prev.map((slide, index) => 
      index === slideIndex ? { ...slide, content } : slide
    ));

      // Send update to other collaborators
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'slide_update',
          slideIndex,
          content,
          userId: user?._id
        }));
      }
    } catch (error) { if (import.meta.env.DEV) console.error('Failed to save slide:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.post(`/api/pitchdeck/collaborative/${id}/comment`, {
        text: newComment,
        slideIndex: currentSlide,
        position: { x: 50, y: 50 }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const comment = response.data.comment;
      setComments(prev => [...prev, comment]);
      setNewComment('');

      // Send to other collaborators
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'comment_add',
          comment
        }));
      }
    } catch (error) { if (import.meta.env.DEV) console.error('Failed to add comment:', error);
    }
  };

  const generateTalkingPoints = async () => {
    setScriptLoading(true);
    try {
      const response = await api.post(
        `/api/pitchdeck/talking-points/${id}`,
        { slideIndex: currentSlide },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTalkingPoints(response.data.talkingPoints);
    } catch (error) { if (import.meta.env.DEV) console.error('Failed to generate talking points');
    } finally {
      setScriptLoading(false);
    }
  };

  const startVoicePractice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('slideIndex', currentSlide.toString());
        
        try {
          const response = await api.post(
            `/api/pitchdeck/voice-feedback/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              },
            }
          );
          
          
        } catch (error) { if (import.meta.env.DEV) console.error('Failed to process voice feedback');
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) { if (import.meta.env.DEV) console.error('Failed to start recording');
    }
  };

  const stopVoicePractice = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }


  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/api/pitchdeck/collaborative/${id}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) { if (import.meta.env.DEV) console.error('Failed to delete comment:', error);
    }
  };
  
  const handleInviteCollaborator = async () => {
    try {
      // For now, just copy the collaboration link to clipboard
      const collaborationLink = `${window.location.origin}/collaborative-pitch/${id}`;
      await navigator.clipboard.writeText(collaborationLink);
      alert('Collaboration link copied to clipboard! Share it with your team members.');
      setShowInviteModal(false);
      setInviteEmail('');
    } catch (error) { if (import.meta.env.DEV) console.error('Failed to copy link:', error);
      alert('Failed to copy link. Please try again.');
    }
  };

  return (
    <div className="page-container bg-gray-900">
      <div className="content-wrapper">
        <div className="max-container">
          {/* Header with Collaborators */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h1 className={`text-2xl font-bold text-white`}>
                Collaborative Pitch Deck
              </h1>
              <div className="flex items-center mt-2">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                <span className={`text-sm text-gray-300`}>
                  {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''} online
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={generateTalkingPoints}
                disabled={scriptLoading}
                className="inline-flex items-center px-5 py-2.5 rounded-2xl text-sm font-medium text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25 disabled:opacity-50"
              >
                <Edit3 className={`h-4 w-4 mr-2 ${scriptLoading ? 'animate-spin' : ''}`} />
                {scriptLoading ? 'Generating...' : 'Generate Script'}
              </button>
              
              <button
                onClick={showComments ? () => setShowComments(false) : () => setShowComments(true)}
                className="inline-flex items-center px-5 py-2.5 rounded-2xl text-sm font-medium border-2 transition-all duration-300 border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/10"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Comments ({comments.filter(c => c.slideIndex === currentSlide).length})
              </button>
              
              <button
                onClick={isRecording ? stopVoicePractice : startVoicePractice}
                className={`inline-flex items-center px-5 py-2.5 rounded-2xl text-sm font-medium text-white transition-all duration-300 shadow-lg ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:shadow-green-500/25'}`}
              >
                {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                {isRecording ? 'Stop Practice' : 'Voice Practice'}
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Slide Editor */}
            <div className="lg:col-span-3">
              <motion.div 
                className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-3xl shadow-2xl p-8 min-h-[600px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {slides[currentSlide] && (
                  <div className="relative">
                    <h2 className={`text-2xl font-bold mb-6 text-white`}>
                      {slides[currentSlide].title}
                    </h2>
                    
                    {isEditing ? (
                      <div>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className={`w-full h-96 p-4 rounded-xl bg-gray-700 text-white border-2 border-blue-500`}
                        />
                        <div className="flex justify-end space-x-4 mt-4">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2.5 rounded-2xl text-sm font-medium border-2 transition-all duration-300 border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/10"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              handleSlideEdit(currentSlide, editContent);
                              setIsEditing(false);
                            }}
                            className="inline-flex items-center px-6 py-2.5 rounded-2xl text-sm font-medium text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:shadow-green-500/25"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className={`prose max-w-none prose-invert`}
                        onClick={() => {
                          setIsEditing(true);
                          setEditContent(slides[currentSlide].content);
                        }}
                      >
                        <div className={`p-4 rounded-xl cursor-pointer hover:bg-gray-100/50 hover:bg-gray-700/50`}>
                          {slides[currentSlide].content}
                        </div>
                      </div>
                    )}

                    {/* Collaborator Cursors */}
                    {collaborators.map((collaborator) => (
                      collaborator.cursor && (
                        <div
                          key={collaborator.userId}
                          className="absolute pointer-events-none"
                          style={{
                            left: `${collaborator.cursor.x}%`,
                            top: `${collaborator.cursor.y}%`
                          }}
                        >
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded mt-1">
                            {collaborator.userName}
                          </div>
                        </div>
                      )
                    ))}

                    {/* Comments on Slide */}
                    {comments
                      .filter(comment => comment.slideIndex === currentSlide)
                      .map((comment) => (
                        <div
                          key={comment.id}
                          className="absolute"
                          style={{
                            left: `${comment.position.x}%`,
                            top: `${comment.position.y}%`
                          }}
                        >
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="ml-auto text-red-500 hover:text-red-700 text-xs"
                            >
                              Delete
                            </button>
                          <div className="w-4 h-4 bg-yellow-500 rounded-full cursor-pointer"></div>
                          <div className={`absolute top-6 left-0 w-64 p-3 rounded-xl shadow-lg bg-gray-800 border-gray-700 border z-10`}>
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                                {comment.userName.charAt(0)}
                              </div>
                              <span className={`text-sm font-medium text-white`}>
                                {comment.userName}
                              </span>
                            </div>
                            <p className={`text-sm text-gray-300`}>
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </motion.div>

              {/* Slide Navigation */}
              <SlideThumbnails
                slides={slides}
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Talking Points */}
              {talkingPoints.length > 0 && (
                <motion.div 
                  className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-3xl shadow-2xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <h3 className={`text-lg font-bold mb-4 text-white flex items-center`}>
                    <Play className="h-5 w-5 mr-2 text-green-500" />
                    Talking Points
                  </h3>
                  <ul className="space-y-2">
                    {talkingPoints.map((point, index) => (
                      <li key={index} className={`text-sm text-gray-300 flex items-start`}>
                        <span className="text-green-500 mr-2">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Comments Panel */}
              <motion.div 
                className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-3xl shadow-2xl p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h3 className={`text-lg font-bold mb-4 text-white flex items-center`}>
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Comments
                </h3>
                
                <form onSubmit={handleAddComment} className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className={`w-full p-3 rounded-xl text-sm bg-gray-700 text-white border-2 border-transparent focus:border-blue-500`}
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="w-full mt-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                  >
                    Add Comment
                  </button>
                </form>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {comments
                    .filter(comment => comment.slideIndex === currentSlide)
                    .map((comment) => (
                      <div key={comment.id} className={`p-3 rounded-xl bg-gray-700/50`}>
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                            {comment.userName.charAt(0)}
                          </div>
                          <span className={`text-sm font-medium text-white`}>
                            {comment.userName}
                          </span>
                        </div>
                        <p className={`text-sm text-gray-300`}>
                          {comment.text}
                        </p>
                      </div>
                    ))}
                </div>
              </motion.div>

              {/* Collaborators */}
              <motion.div 
                className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-3xl shadow-2xl p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <h3 className={`text-lg font-bold mb-4 text-white flex items-center`}>
                  <Users className="h-5 w-5 mr-2 text-purple-500" />
                  Collaborators
                </h3>
                
                <div className="space-y-3">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.userId} className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                        {collaborator.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium text-white`}>
                          {collaborator.userName}
                        </p>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${collaborator.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className={`text-xs text-gray-400`}>
                            {collaborator.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setShowInviteModal(true)}
                  className="w-full mt-4 flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-300 border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/10"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Invite Collaborators
                </button>
              </motion.div>
            </div>
          </div>

          <InviteModal 
            isOpen={showInviteModal} 
            onClose={() => setShowInviteModal(false)} 
            onInvite={handleInviteCollaborator} 
          />
        </div>
      </div>
    </div>
  );
};

export default CollaborativePitchDeck;
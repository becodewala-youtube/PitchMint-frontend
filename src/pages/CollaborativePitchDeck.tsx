import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Edit3, Save, Share2, Play, Mic, MicOff } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

interface Comment {
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
  const { darkMode } = useTheme();
  
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
  
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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

  const handleSlideEdit = (slideIndex: number, content: string) => {
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
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const comment: Comment = {
      id: Date.now().toString(),
      userId: user?._id || '',
      userName: user?.name || '',
      text: newComment,
      slideIndex: currentSlide,
      position: { x: 50, y: 50 }, // Default position
      createdAt: new Date().toISOString()
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');

    // Send to other collaborators
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'comment_add',
        comment
      }));
    }
  };

  const generateTalkingPoints = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/pitch-deck/talking-points/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTalkingPoints(response.data.talkingPoints);
    } catch (error) {
      console.error('Failed to generate talking points');
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
          const response = await axios.post(
            `${API_URL}/api/pitch-deck/voice-feedback/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              },
            }
          );
          
          // Handle voice feedback
          console.log('Voice feedback:', response.data);
        } catch (error) {
          console.error('Failed to process voice feedback');
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording');
    }
  };

  const stopVoicePractice = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className={`page-container ${darkMode ? 'page-container-dark' : 'page-container-light'}`}>
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
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Collaborative Pitch Deck
              </h1>
              <div className="flex items-center mt-2">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''} online
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={generateTalkingPoints}
                className="btn-primary btn-primary-blue"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Generate Script
              </button>
              
              <button
                onClick={showComments ? () => setShowComments(false) : () => setShowComments(true)}
                className={`btn-secondary ${darkMode ? 'btn-secondary-dark' : 'btn-secondary-light'}`}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Comments ({comments.filter(c => c.slideIndex === currentSlide).length})
              </button>
              
              <button
                onClick={isRecording ? stopVoicePractice : startVoicePractice}
                className={`btn-primary ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'btn-primary-green'}`}
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
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 min-h-[600px]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {slides[currentSlide] && (
                  <div className="relative">
                    <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {slides[currentSlide].title}
                    </h2>
                    
                    {isEditing ? (
                      <div>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className={`w-full h-96 p-4 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border-2 border-blue-500`}
                        />
                        <div className="flex justify-end space-x-4 mt-4">
                          <button
                            onClick={() => setIsEditing(false)}
                            className={`btn-secondary ${darkMode ? 'btn-secondary-dark' : 'btn-secondary-light'}`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              handleSlideEdit(currentSlide, editContent);
                              setIsEditing(false);
                            }}
                            className="btn-primary btn-primary-green"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}
                        onClick={() => {
                          setIsEditing(true);
                          setEditContent(slides[currentSlide].content);
                        }}
                      >
                        <div className={`p-4 rounded-xl cursor-pointer hover:bg-gray-100/50 ${darkMode ? 'hover:bg-gray-700/50' : ''}`}>
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
                          <div className="w-4 h-4 bg-yellow-500 rounded-full cursor-pointer"></div>
                          <div className={`absolute top-6 left-0 w-64 p-3 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border z-10`}>
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                                {comment.userName.charAt(0)}
                              </div>
                              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {comment.userName}
                              </span>
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </motion.div>

              {/* Slide Navigation */}
              <div className="flex justify-center mt-6 space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'bg-blue-500 scale-125'
                        : darkMode
                          ? 'bg-gray-600 hover:bg-gray-500'
                          : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Talking Points */}
              {talkingPoints.length > 0 && (
                <motion.div 
                  className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-6`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <Play className="h-5 w-5 mr-2 text-green-500" />
                    Talking Points
                  </h3>
                  <ul className="space-y-2">
                    {talkingPoints.map((point, index) => (
                      <li key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-start`}>
                        <span className="text-green-500 mr-2">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Comments Panel */}
              <motion.div 
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-6`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Comments
                </h3>
                
                <form onSubmit={handleAddComment} className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className={`w-full p-3 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border-2 border-transparent focus:border-blue-500`}
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="w-full mt-2 btn-primary btn-primary-blue text-sm"
                  >
                    Add Comment
                  </button>
                </form>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {comments
                    .filter(comment => comment.slideIndex === currentSlide)
                    .map((comment) => (
                      <div key={comment.id} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                            {comment.userName.charAt(0)}
                          </div>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {comment.userName}
                          </span>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {comment.text}
                        </p>
                      </div>
                    ))}
                </div>
              </motion.div>

              {/* Collaborators */}
              <motion.div 
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-6`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
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
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {collaborator.userName}
                        </p>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${collaborator.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {collaborator.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 btn-secondary btn-secondary-dark">
                  <Share2 className="h-4 w-4 mr-2" />
                  Invite Collaborators
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativePitchDeck;
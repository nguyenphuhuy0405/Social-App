import './messenger.css';
import Topbar from '../../components/topbar/Topbar';
import Message from '../../components/message/Message';
import Conversation from '../../components/conversation/Conversation.jsx';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../utils/axios';

function Messenger() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState('');
    const [arrivalMessages, setArrivalMessages] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(null);

    const { user, socket } = useContext(AuthContext);
    const scrollRef = useRef();

    useEffect(() => {
        socket.emit('Client-Send-AddUser', user._id);
        socket.on('Server-Send-Users', (users) => {
            setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)));
        });
        socket.on('Server-Send-NewMessage', (data) => {
            console.log('>>>>>>>new message:', data);
            setArrivalMessages({
                sender: data?.senderId,
                text: data?.text,
                createdAt: Date.now(),
            });
        });
    }, [user]);

    useEffect(() => {
        arrivalMessages &&
            currentChat?.members.includes(arrivalMessages?.sender) &&
            setMessages((prev) => [...prev, arrivalMessages]);
    }, [arrivalMessages]);

    // get conversations
    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get('/conversations/' + user._id);
                console.log('res:', res.data);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);

    // get messages
    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get('/messages/' + currentChat._id);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, [currentChat]);

    //Scroll down to last message when new message is added
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessages,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find((member) => member !== user._id);
        try {
            const res = await axios.post('/messages', message);
            setMessages([...messages, res.data]);
            setNewMessages('');
            socket.emit('Client-Send-NewMessage', {
                senderId: user._id,
                receiverId: receiverId,
                text: newMessages,
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInput" />
                        {conversations.map((c, index) => (
                            <div key={index} onClick={() => setCurrentChat(c)}>
                                <Conversation conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                <div className="chatBoxTop">
                                    {messages.map((m) => (
                                        <div ref={scrollRef}>
                                            <Message message={m} own={m.sender === user._id} />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea
                                        className="chatMessageInput"
                                        placeholder="Write something..."
                                        onChange={(e) => setNewMessages(e.target.value)}
                                        value={newMessages}
                                    />
                                    <button className="chatSubmitButton" onClick={handleSubmit}>
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <span className="noConversationText">Open conversation to start</span>
                        )}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Messenger;

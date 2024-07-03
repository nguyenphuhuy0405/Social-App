import './chatOnline.css';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';

function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get('/users/friends/' + currentId);
            setFriends(res.data);
        };
        getFriends();
    }, [currentId]);

    useEffect(() => {
        setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
    }, [friends, onlineUsers]);

    console.log('onlineUsers:', onlineUsers);

    const handleClick = async (user) => {
        try {
            const res = await axios.get(`/conversations/find/${currentId}/${user._id}`);
            setCurrentChat(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="chatOnline">
            {onlineFriends.length > 0 &&
                onlineFriends.map((o, index) => (
                    <div className="chatOnlineFriend" key={index} onClick={() => handleClick(o)}>
                        <div className="chatOnlineImgContainer">
                            <img
                                className="chatOnlineImg"
                                src={o?.profilePicture ? PF + o?.profilePicture : PF + 'person/noAvatar.png'}
                                alt=""
                            ></img>
                            <div className="chatOnlineBadge"></div>
                        </div>
                        <span className="chatOnlineName">{o?.username}</span>
                    </div>
                ))}
        </div>
    );
}

export default ChatOnline;

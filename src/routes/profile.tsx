import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
const NameColumn = styled.div`
  gap: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EditName = styled.label`
  color: white;
  width: 20px;
  height: 20px;
  cursor: pointer;
  &:hover {
    color: #1d9bf0;
  }
`;
const EditNameButtonInput = styled.button`
  display: none;
`;

const EditNameInput = styled.input`
  background-color: transparent;
  text-align: center;
  color: #1d9bf0;
  font-size: 22px;
  border: none;
  caret-color: #1d9bf0;
  &:focus {
    outline: none;
  }
`;

export default function Profile() {
  const user = auth.currentUser;
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [name, setName] = useState(user?.displayName);
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const activeEsc = () => {
    // console.log("press esc....");
    setName(user?.displayName); // 원래이름으로 초기화...
    setIsNameEditing(false);
  };

  const activeEnter = async () => {
    console.log(name);
    setName(name); // 입력한 이름으로 변경
    setIsNameEditing(false);
  };

  const onEnterKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // enter 키를 누르면 이름 변경
      await activeEnter();
    } else if (e.key === "Escape") {
      // esc 키를 누르면 이름변경 취소
      activeEsc();
    }
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 키보드에 입력하면 입력한대로 저장..
    setName(e.target.value);
  };

  const onClickEditNameButton = () => {
    setIsNameEditing(true);
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);

      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, userName, photo } = doc.data();
      return {
        id: doc.id,
        tweet,
        createdAt,
        userId,
        userName,
        photo,
      };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);
  useLayoutEffect(() => {
    // 입력창 커서 포커스
    if (inputRef.current !== null) inputRef.current.focus();
  });

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />
      <NameWrapper>
        <NameColumn>
          {isNameEditing ? (
            <Name>
              <EditNameInput
                placeholder={`${user?.displayName ?? ""} (취소: esc)`}
                onChange={onNameChange}
                onKeyDown={onEnterKeyDown}
                ref={inputRef}
                id="name"
              />
            </Name>
          ) : (
            <Name>{user?.displayName ?? "Anonymous"}</Name>
          )}
        </NameColumn>
        <NameColumn>
          {isNameEditing ? null : (
            <EditName htmlFor="edit-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
              </svg>
              <EditNameButtonInput id="edit-button" onClick={onClickEditNameButton} />
            </EditName>
          )}
        </NameColumn>
      </NameWrapper>

      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}

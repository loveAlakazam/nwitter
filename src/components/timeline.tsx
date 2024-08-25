import { collection, limit, onSnapshot, orderBy, query, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  tweet: string;
  userId: string;
  userName: string;
  createdAt: number;
  photo?: string;
}
const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;
export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    // useEffect 는 tear down, clean up 기능 사용
    //             유저가 화면에 보지않을 때 값을 반환하면서 cleanup을 실시함.
    // 실시간 변경사항 - 구독취소함수
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(collection(db, "tweets"), orderBy("createdAt", "desc"), limit(25));
      /*
      const snapshot = await getDocs(tweetsQuery);
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
      */

      // 구독 취소
      // real-time(실시간) query - 이벤트리스터를 항상 켜놓는 상태이다.
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
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
      });
    };
    fetchTweets();

    // 유저가 로그아웃됐을때
    // 컴포넌트가 사용되지않을때 보이지않을때는 호출 및 실행함.
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}

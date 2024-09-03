import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;
const UserName = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;
const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin: 0px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

// 수정폼 활성화
const EditButton = styled.button`
  background-color: #7f8689;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

// 수정폼
const EditTweetFormTextArea = styled.textarea`
  background-color: black;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  resize: none;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
  }
`;

const EditorColumns = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
`;

// 수정버튼
const UpdateButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

// 수정취소버튼
const CancelButton = styled.button`
  background-color: #7f8689;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin: 0px 10px;
  cursor: pointer;
`;

// 이미지 수정 버튼
const SetImageButton = styled.label`
  color: white;
  cursor: pointer;
  &:hover {
    color: #1d9bf0;
  }
  svg {
    width: 24px;
  }
`;

const SetImageButtonInput = styled.button`
  display: none;
`;

export default function Tweet({ userName, photo, tweet, userId, id }: ITweet) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet);
  const [isEditPhoto, setIsEditPhoto] = useState(false);

  const user = auth.currentUser;
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTweet(e.target.value);
  };
  const handleCancel = () => {
    // isEditing 값: true -> false 로 변경
    setIsEditing(false);
  };
  const handleEdit = async () => {
    // isEditing 값: false -> true 로 변경
    setIsEditing(true);
  };
  const onUpdate = async () => {
    try {
      console.log("updated!");
      // tweet 업데이트
      await updateDoc(doc(db, "tweets", id), { tweet: editedTweet });

      // tbd: 사진도 같이 업데이트하기.
      // 사진이 있든 없든 사진도 변경할 수 있도록 하기.
      // 사진 존재하면 업데이트된 사진으로 변경하기.
    } catch (e) {
      console.error(e);
    } finally {
      setIsEditing(false);
    }
  };
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");

    // 승낙을 안하거나 || 트위터작성자가 아니면 삭제 취소.
    if (!ok || user?.uid !== userId) return;
    try {
      // tweet 삭제
      await deleteDoc(doc(db, "tweets", id));

      // tweet삭제할때 같이 첨부한 이미지도 삭제
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const onClickSetImageButton = async (e: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <Wrapper>
      <Column>
        <UserName>{userName}</UserName>
        {isEditing ? (
          <EditTweetFormTextArea
            rows={5}
            maxLength={180}
            onChange={onChange}
            placeholder={tweet}
            value={editedTweet}
          ></EditTweetFormTextArea>
        ) : (
          <Payload>{tweet}</Payload>
        )}

        <EditorColumns>
          {user?.uid === userId ? (
            <>
              {isEditing ? (
                <>
                  <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                  <UpdateButton onClick={onUpdate}>Update</UpdateButton>
                  <SetImageButton htmlFor="edit-photo">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <SetImageButtonInput id="edit-photo" onClick={onClickSetImageButton} />
                  </SetImageButton>
                </>
              ) : (
                <EditButton onClick={handleEdit}>Edit</EditButton>
              )}
            </>
          ) : null}
          {
            // 삭제 버튼
            user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null
          }
        </EditorColumns>
      </Column>
      <Column>{isEditPhoto ? <></> : photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}

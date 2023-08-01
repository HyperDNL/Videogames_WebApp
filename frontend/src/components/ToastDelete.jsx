import React, { useState } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import DangerButton from "./DangerButton";
import SecondaryButton from "./SecondaryButton";
import Loader from "./Loader";

const ToastContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleToast = styled.h4`
  color: #a8acaf;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const ToastDelete = ({ idToast, idVideogame, deleteVideogame }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteVideogame(idVideogame);
    } finally {
      toast.dismiss(idToast);
    }
  };

  const handleCancel = () => {
    setIsDeleting(false);
    toast.dismiss(idToast);
  };

  return (
    <ToastContainer>
      <TitleToast>
        {isDeleting ? "Deleting videogame..." : "Do you want to delete?"}
      </TitleToast>
      {isDeleting ? (
        <Loader size={25} width={2} />
      ) : (
        <ButtonContainer>
          <DangerButton onClick={handleDelete} disabled={isDeleting}>
            Delete
          </DangerButton>
          <SecondaryButton onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </SecondaryButton>
        </ButtonContainer>
      )}
    </ToastContainer>
  );
};

export default ToastDelete;

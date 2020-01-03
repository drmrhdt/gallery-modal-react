import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import classNames from "classnames";
import Form from "../Form";
import Comments from "../Comments";
import { getImage, addComment } from "../../utilities/fetch";
// import loading from "../../img/loading.png";
import styles from "./Modal.module.scss";

const Modal = props => {
  let history = useHistory();
  const { id } = useParams();
  const [url, setUrl] = useState("");
  const [comments, setComments] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // setIsLoading(true);
      const response = await getImage(id);
      // setIsLoading(false);
      setUrl(response.url);
      setComments(response.comments);
    };

    fetchData();

    return () => {
      setModalStatus(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (modalStatus) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [modalStatus]);

  const back = e => {
    if (e.target.dataset.modal) {
      e.stopPropagation();
      history.goBack();
      setModalStatus(false);
    }
  };

  const addNewComment = async (name, comment) => {
    await addComment(id, { name: name, comment: comment });
    setComments(
      comments.concat({
        id: Math.floor(Math.random() * 10000),
        text: comment
      })
    );
  };

  return (
    <div className={styles.bg} data-modal={true} onClick={back}>
      <div
        className={classNames(
          styles.modal,
          comments.length
            ? styles.modal__with_comments
            : styles.modal__without_comments
        )}
      >
        <div>
          <button
            className={styles.modal__close_btn}
            data-modal={true}
            onClick={back}
          />
          <div className={styles.modal__image_comments_column}>
            <div className={styles.modal_image__container}>
              <img className={styles.modal__image} src={url} alt="modal item" />
            </div>
            {comments.length ? (
              <Comments
                className={classNames(
                  styles.modal__comments,
                  styles.modal__comments_column
                )}
                comments={comments}
              />
            ) : null}
          </div>
          <Form className={styles.modal__form} addNewComment={addNewComment} />
        </div>
        {comments.length ? (
          <Comments
            className={classNames(
              styles.modal__comments,
              styles.modal__comments_row
            )}
            comments={comments}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Modal;

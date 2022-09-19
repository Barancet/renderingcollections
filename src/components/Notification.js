const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={message.includes("STATUS") ? "good" : "error"}>
      {" "}
      {message}
    </div>
  );
};

export default Notification;

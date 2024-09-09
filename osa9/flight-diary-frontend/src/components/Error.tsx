interface ErrorProps {
  message: string
}

const Error = (props: ErrorProps) => {
  if (props.message === '') {
    return; 
  }
  return (
    <div style={{ color: 'red' }}>
      {props.message}
    </div>
  );
};

export default Error;
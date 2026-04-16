import './Loader.css';

export default function Loader({ message = 'Converting your PDF into audio...' }) {
  return (
    <div className="loader" id="conversion-loader">
      <div className="loader__bars">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="loader__bar" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <p className="loader__text">{message}</p>
      <div className="loader__shimmer" />
    </div>
  );
}

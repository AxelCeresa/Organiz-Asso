import { Link } from 'react-router-dom';
import './NotFound.css'

function NotFound (props) {
  return (
    <div className="error-container">
      <h1>404</h1>
      <p>Page not found</p>
      <p>Désolé, la page à laquelle vous essayez d'accéder n'existe pas ou est temporairement indisponible.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default NotFound;

import "./style/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-brand">EventSphere</p>
        <p className="footer-copy">
          © {new Date().getFullYear()} EventSphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
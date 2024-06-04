import axios from 'axios';
import { useNotifications } from '../providers/NotificationContext';

export const Signup = (props) => {
  const { createNotification } = useNotifications();

  async function addUser(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    try {
      const response = await axios.post(`${process.env.REACT_APP_PROXY_URL}/email`, { email });
      // check if response body is "Email added successfully"
      if (response.data.message === 'Email added successfully') {
        createNotification('success', 'Subscribed successfully!');
      }
    } catch (error) {
      createNotification('error', 'Failed to subscribe! Please check your email or try again later!');
    }
  }

  return (
    <div id='about'>
      <div className='container' style={{ width: "90%" }}>
        <section style={{
          backgroundColor: '#182538', paddingTop: '2rem', paddingRight: '1rem', paddingBottom: '2rem', paddingLeft: '1rem', margin: 'auto',
        }}>
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '3rem', fontWeight: '500', letterSpacing: '-0.025em', color: '#ffffff' }}>Join our free newsletter</h1>
            <form style={{ width: "100%" }}>
              <div style={{ margin: 'auto', marginBottom: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: "30%", position: 'relative', margin: "auto", paddingBottom: "0.5rem", marginBottom: "0.8rem" }}>
                  <label htmlFor="email" style={{ display: 'none', fontSize: '1.2rem', fontWeight: '500', color: '#374151' }}>Email address</label>
                  <input style={{ padding: '0.75rem', paddingLeft: '1rem', width: '100%', fontSize: '1.25rem', color: '#374151', backgroundColor: '#fff', borderRadius: '0.375rem', border: '1px solid #e5e7eb', outline: 'none', transition: 'border-color 0.15s ease, box-shadow 0.15s ease' }} placeholder="Enter your email" type="email" id="email" required />
                </div>
                <div style={{ width: "10%", margin: "auto" }}>
                  <button onClick={addUser} style={{ padding: '0.75rem 1.25rem', width: '100%', fontSize: '1.5rem', fontWeight: '500', textAlign: 'center', color: '#fff', backgroundColor: '#000', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.15s ease' }}>Subscribe</button>
                </div>
              </div>
              <div style={{ margin: 'auto', maxWidth: '30rem', fontSize: '1rem', fontWeight: '300', color: '#ffffff' }}>We care about the protection of your data. <a href="https://chromewebstore.google.com/detail/jkjust-kidding/ginbifmggkalapnegdhabemjendojpbp?pli=1" target="_blank" style={{ fontWeight: '500', color: '#3b82f6', textDecoration: 'none', transition: 'color 0.15s ease' }}>Read our Privacy Policy</a>.</div>
            </form>
          </div>
        </section>
      </div>
    </div >
  )
}
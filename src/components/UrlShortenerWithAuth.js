


import React, { useEffect, useState } from 'react';

const UrlShortenerWithAuth = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const [redirect,setRedirect]=useState("");
    const [longUrlBool,setLongUrlBool]=useState(false)
    const [url,setUrl]=useState('')
    const [feShortUrl,setfeShortUrl]=useState("")

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:8081/user/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });
            // Check for duplicate registration
            if (response.status === 400) {
                const text = await response.text(); // Get response as text
                
                
                try {
                    const data = JSON.parse(text); // Try to parse as JSON
                    if (data.message === 'User already exists') {
                        setError('User already registered. ');
                        return;
                    }
                } catch {
                    setError(text); // Set the error from the response text
                    return;
                }
            }

            if (!response.ok) {
                throw new Error('Failed to register. Please try again.');
            }

            setSuccessMessage('Registration successful! ');
            setIsLogin(true);
            resetForm();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLoginAndShortenUrl = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const authString = `${email}:${password}`;
        const headers = new Headers({
            'Authorization': `Basic ${btoa(authString)}`,
            'Content-Type': 'application/json',
        });

        try {
            const response = await fetch('http://localhost:8081/url/shortener', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ url: longUrl }),
            });
            
            if (response.status === 201) {
                const text = await response.text(); // Get response as text
                try {
                    const data = JSON.parse(text); // Try to parse as JSON
                    if (data.message === 'success') {
                        setSuccessMessage('success');
                        return;
                    }
                } catch {
                    setShortUrl(`http://localhost:8081/url/shortener/${text}`); // Set the error from the response text
                    setfeShortUrl(JSON.stringify(`${text}`))
                    return;
                }
            }
            // Check for login errors
          else  if (response.status === 400) {
                const text = await response.text(); // Get response as text
                try {
                    const data = JSON.parse(text); // Try to parse as JSON
                    if (data.message === 'Invalid credentials') {
                        setError('Invalid email or password. Please try again.');
                        return;
                    }
                } catch {
                    setError(text); // Set the error from the response text
                    return;
                }
            }

            const data = await response.json();

            if (!response.ok || !data.shortUrl) {
                setError('Failed to shorten the URL. Please try again.');
                return;
            }

            setShortUrl(data.shortUrl);
            setfeShortUrl(JSON.stringify(shortUrl))

            setLongUrl('');
            setSuccessMessage('URL shortened successfully!');
        } catch (err) {
            console.error(err);
            setError('An error occurred while shortening the URL.');
        }
    };

    const originalUrl = async () => {
        try {
            // console.log("Fetching original URL from:", shortUrl);
    
            const response = await fetch(shortUrl, {
                method: 'GET'
            });
               
            const originalUrlText = await response.text();
            // console.log("Original URL fetched:", originalUrlText);
    
            setRedirect(originalUrlText);
        
        } catch (error) {
            console.error('Error fetching original URL:', error);
        }
    };


    //getting user entered url
    const fetchUrl = async (url) => {
        try {
            //console.log("Fetching original URL from:", url);
           
            const response = await fetch(`http://localhost:8081/url/shortener/${url}`, {
                method: 'GET'
            });
               
            const originalUrlText = await response.text();
            // console.log("Original URL fetched:", originalUrlText);
             
            setLongUrl(originalUrlText);
        
        } catch (error) {
            console.error('Error fetching original URL:', error);
        }
    };
    
    
    

    useEffect(()=>{
        originalUrl();
    },[shortUrl])

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setLongUrl('');
        setShortUrl('');
        setfeShortUrl('');

    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px', margin: 'auto' }}>
            <h1 className="text-center">{isLogin ? 'UrlShortener' : 'Register'}</h1>
          
            <form onSubmit={isLogin ? handleLoginAndShortenUrl : handleRegister} className="mt-4">
                {!isLogin && (
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            required={!isLogin}
                        />
                    </div>
                )}
                <div className="form-group mb-3">
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                </div>
                {isLogin && (
                    <div className="form-group mb-3">
                        <input
                            type="url"
                            className="form-control"
                            value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                            placeholder="Enter your long URL"
                            required
                        />
                    </div>
                )}
                <button type="submit" className="btn btn-primary btn-block">
                    {isLogin ? 'Shorten URL' : 'Register'}
                </button>
            </form>

            <div className="text-center mt-3">
                <button
                    className="btn btn-link"
                    onClick={() => {
                        setIsLogin(!isLogin);
                        resetForm();
                    }}
                >
                    {isLogin ? 'Need to register? ' : 'Already registered?'}
                </button>
            </div>

            {/* Display the short URL directly below the button */}
            {shortUrl && (
                <div>

<div className="mt-4">
                    <h3>Shortened URL:</h3>
                    <a href={redirect} target="_blank" rel="noopener noreferrer">
                        {feShortUrl}
                    </a>
                </div>


<div>

                        
                    </div>

                </div>

            )}
            <div className=' flex-col gap-5'>
                    <input placeholder='Enter the shortened URL' value={url} onChange={(e)=>{setUrl(e.target.value)}} />  
                    <button className='btn btn-primary btn-block' onClick={()=>{fetchUrl(url);
                         setLongUrlBool(true)}}>Fetch original URL</button>
                    </div>  
                      
                              {longUrlBool &&   <a href={longUrl} target="_blank" rel="noopener noreferrer">
                            {longUrl}
                            </a>}
            {/* Display error and success messages */}
            {error && <div className="alert alert-danger mt-4">{error}</div>}
            {successMessage && <div className="alert alert-success mt-4 " >{successMessage}</div>}
          

        </div>
    );
};

export default UrlShortenerWithAuth;


import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal'
import './LoginForm.css'


const LoginFormModal = () => {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const { closeModal } = useModal()

    useEffect(() => {
        const valErrors = {}

        if (credential.length <= 4 && credential.length > 0) {
            valErrors.credential = "Username must be more than 4 characters"
        }

        if (password.length <= 6) {
            valErrors.password = "Password must be more than 6 characters"
        }

        setErrors(valErrors)
    }, [credential, password])

    const loginDemo = (e) => {
        e.preventDefault();
        return dispatch(sessionActions.login({
            credential: 'Demo-lition',
            password: 'password'
        }))
        .then(closeModal)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({})
        return dispatch(sessionActions.login({
            credential, password
        }))
        .then(closeModal)
        .catch(
            async (res) => {
                const data = await res.json();
                if (data?.message) setErrors(data);
                console.log(data?.message)
                console.log(errors)
            }
        );
    };
    return (
        <div className='login'>
        <h1>Log In</h1>
        {errors.message && <p>The provided credentials were invalid</p>}
        <form onSubmit={handleSubmit}>
            <label>
                Username or Email
                <input
                    type="text"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    required
                />
            </label>
            <label>
                Password
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            {errors.credential && <p>{errors.credential}</p>}
            <button type="submit" disabled={Object.values(errors).length}>Log In</button>
        </form>
        <button type="button" onClick={loginDemo}>Log in as Demo User</button>
        </div>
    )
}

export default LoginFormModal;

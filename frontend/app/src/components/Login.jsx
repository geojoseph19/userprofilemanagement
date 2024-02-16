
import login from './Login.module.css'


let Login=()=>{



    return(
    <div className={login.loginContainer}>
     <form action='/login' method='POST'>
    <fieldset >
        <legend>Login</legend>
        <div className="mb-3">
        <label htmlFor="user" className="form-label">Username</label>
        <input type="text"  className="form-control" id="username" name="username" />
        </div>
        <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input type="password" className="form-control" id="password" name="password"/>
    </div>
        <button type="submit" className={`btn ${login.loginButton} my-4`} id="loginButton">Login</button>
    </fieldset>
    </form>
    </div>
    )
}

export default Login;
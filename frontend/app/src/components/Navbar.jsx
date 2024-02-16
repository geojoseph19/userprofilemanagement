import styles from './Navbar.module.css'

let Navbar=(props)=>{

    return(
        <div className="navbar mx-5">
<div className={styles.title}>
        <strong>
            {props.name}
        </strong>
</div>

        <ul class={`nav ${styles.links}`}>

  <li class="nav-item">
    <a class={`nav-link ${styles.navLink}`} aria-current="page" href="#">About Us</a>
  </li>
  <li class="nav-item">
    <a class={`nav-link ${styles.navLink}`}href="#">Contact</a>
  </li>
 
</ul>

<div className={styles.switchContainer}>
<div class="form-check form-switch">
  <input class={`form-check-input ${styles.formCheckInput}`} type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
  <label class={styles.switchLabel} for="flexSwitchCheckDefault">Dark Mode</label>
</div>
</div>

<div className={styles.profile}>
        <div className={styles.profile_pic}>
            <img src="" alt="My Profile photo"/>
        </div>
</div>

</div>
    )
}


export default Navbar;
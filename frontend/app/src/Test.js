import style from './Apps.module.css'

function Test(){
    let a='Hello world';

    return(
        <>
        <h1 className={style.bg1}>{a}</h1>
        <p>This is a test page in React</p>
        </>
        )
}


export default Test;
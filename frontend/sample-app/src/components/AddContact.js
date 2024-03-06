import React from "react";

class AddContact extends React.Component{
    render(){
        return(
            <div className="ui main">
                <h2>Add User</h2>
                <form className="ui form">
                    <div classname="field">
                        <label>Name</label>
                        <input type="text" name="name" placeholder="text"></input>
                    </div>
                    <div classname="field">
                        <label>Name</label>
                        <input type="text" name="name" placeholder="text"></input>
                    </div>
                    <button className="ui button blue">Add</button>
                </form>
            </div>
        );
    }
};

export default AddContact;
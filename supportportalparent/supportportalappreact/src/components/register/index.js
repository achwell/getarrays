import React from 'react';

function RegisterComponent() {
    return (
        <div className="materialContainer">

            <div className="overbox">
                <div className="material-button alt-2"><span className="shape"></span></div>

                <div className="title">REGISTER</div>

                <div className="input">
                    <label htmlFor="regname">Username</label>
                    <input type="text" name="regname" id="regname"/>
                        <span className="spin"></span>
                </div>

                <div className="input">
                    <label htmlFor="regpass">Password</label>
                    <input type="password" name="regpass" id="regpass"/>
                        <span className="spin"></span>
                </div>

                <div className="input">
                    <label htmlFor="reregpass">Repeat Password</label>
                    <input type="password" name="reregpass" id="reregpass"/>
                        <span className="spin"></span>
                </div>

                <div className="button">
                    <button><span>NEXT</span></button>
                </div>


            </div>

        </div>
    )
}

export default RegisterComponent;
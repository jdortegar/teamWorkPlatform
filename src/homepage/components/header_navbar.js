import React from 'react';

const HeaderNavbar = () => {
	return (
		<nav className="navbar navbar-lg clearfix">
            <div className="contaniner-fluid">
                <div className="navbar-header">
                    <button className="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#navbar-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>

                    </button>
                    <a className="navbar-brand" href="index.html"><img className="logo" src='/resources/img/logo.png' />	
                    </a>
                    <span className="logo-habla">Habla</span>
                </div>
                <div className="collapse navbar-collapse" id="navbar-collapse">
                    <ul className="nav navbar-nav navbar-right">
                        <li><a href="#/">Product</a></li>
                        <li><a href="#/menu">Pricing</a></li>
                        <li><a href="#/graph">Graph</a></li>
                        <li><a href="#/aboutus">Your Teams</a></li>
                        <li><a href="#/aboutus">Sign In</a></li>
                    </ul>
                </div>
            </div>
        </nav>
	);
}

export default HeaderNavbar;
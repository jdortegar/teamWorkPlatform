import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
// import NavbarHeader from 'react-bootstrap/lib/NavbarHeader';

const HeaderNavbar = () => {
	return (
		<Navbar inverse collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="index.html"><img className="logo" src='/resources/img/logo.png' />
                    </a>
                    <span className="logo-habla">Habla</span>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight>
                    <NavItem eventKey={1} href="#/">Product</NavItem>
                    <NavItem eventKey={2} href="#/">Pricing</NavItem>
                    <NavItem eventKey={3} href="#/">Your Teams</NavItem>
                    <NavItem eventKey={4} href="#/">Sign In</NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
	);
}

export default HeaderNavbar;

// <nav className="navbar navbar-lg clearfix">
//     <div className="contaniner-fluid">
//         <div className="navbar-header">
//             <button className="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#navbar-collapse">
//                 <span className="sr-only">Toggle navigation</span>
//                 <span className="icon-bar"></span>
//                 <span className="icon-bar"></span>
//                 <span className="icon-bar"></span>
//                 <span className="icon-bar"></span>

//             </button>
//             <a className="navbar-brand" href="index.html"><img className="logo" src='/resources/img/logo.png' />    
//             </a>
//             <span className="logo-habla">Habla</span>
//         </div>
//         <div className="collapse navbar-collapse" id="navbar-collapse">
//             <ul className="nav navbar-nav navbar-right">
//                 <li><a href="#/">Product</a></li>
//                 <li><a href="#/menu">Pricing</a></li>
//                 <li><a href="#/graph">Graph</a></li>
//                 <li><a href="#/aboutus">Your Teams</a></li>
//                 <li><a href="#/aboutus">Sign In</a></li>
//             </ul>
//         </div>
//     </div>
// </nav>
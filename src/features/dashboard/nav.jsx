import React from "react";
import {
    FiArrowLeft,
    FiRotateCw,
    FiDownload,
    FiUser,
    FiShare2,
    FiBookmark,
} from "react-icons/fi";

const Nav = () => {
    return (
        <div className="nav-container">
            <div className="nav-section left">
                <button className="nav-icon">
                    <FiArrowLeft />
                </button>
                <button className="nav-icon">
                    <FiRotateCw />
                </button>
            </div>
            <div className="nav-title">ColorSync</div>
            <div className="nav-section right">
                <button className="nav-icon">
                    <FiDownload />
                </button>
                <button className="nav-icon">
                    <FiUser />
                </button>
                <button className="nav-icon">
                    <FiShare2 />
                </button>
                <button className="nav-icon">
                    <FiBookmark />
                </button>
            </div>
        </div>
    );
};

export default Nav;

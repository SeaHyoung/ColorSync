import React, { useState } from "react";
import HeaderBar from "../features/my/headerBar";
import SideProjectList from "../features/my/sideProjectList";
import ProjectTitleBar from "../features/my/projectTitleBar";
import ProjectToolbar from "../features/my/projectToolbar";
import ChartPreviewGrid from "../features/my/chartPreviewGrid";
import "../styles/myPage.css";
export default function myPage() {
    return (
        <div className="project-page">
            <HeaderBar />
            <div className="project-body">
                <SideProjectList />
                <div className="project-content">
                    <ProjectTitleBar />
                    <ProjectToolbar />
                    <ChartPreviewGrid />
                </div>
            </div>
        </div>
    );
}

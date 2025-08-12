const SettingBoard = () => {
    return (
        <div className="setting-board">
            <div className="section attribute-count">
                <label>속성 수</label>
                <div className="attribute-options">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button key={n}>{n}</button>
                    ))}
                </div>
            </div>

            <div className="section emphasis-attributes">
                <label>강조속성</label>
                <div className="attribute-options">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button key={n}>{n}</button>
                    ))}
                </div>
            </div>

            <div className="section recent-backgrounds">
                <label>배경색</label>
                <div className="color-option">
                    {[...Array(6)].map((_, i) => (
                        <button key={i} />
                    ))}
                </div>
            </div>

            <div className="section recent-keycolors">
                <label>키 컬러</label>
                <div className="color-option">
                    {[...Array(6)].map((_, i) => (
                        <button key={i} />
                    ))}
                </div>
            </div>

            <div className="section keywords">
                <label>키워드</label>
                <input type="text" placeholder="# 해시태그 자동완성" />
                <div className="tags">
                    <span># 시원한</span>
                    <span># intellectual</span>
                    <span># modern</span>
                </div>
            </div>

            <div className="section buttons">
                <button className="apply">적용</button>
                <button className="reset">초기화</button>
            </div>

            <div className="section recommendations">
                <label>추천 컬러</label>
                <div className="color-option">
                    {[...Array(6)].map((_, i) => (
                        <button key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingBoard;

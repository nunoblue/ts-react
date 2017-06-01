import React from 'react';
import { DatePicker } from 'antd';

class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Hello React!!!!</h1>
                <div style={{ margin: 10 }}>
                    <DatePicker />
                </div>
            </div>
        );
    }
}

export default App;

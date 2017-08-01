import React from 'react';

const stateToProps = (mixins) => (ProxyComponent) => {
    return mixins.reduce((PrevComponent, Mixin) => {
        return class extends Mixin {
            static displayName = PrevComponent.displayName || PrevComponent.name;
            render() {
                console.log('{this}', this);
                console.log('{props}', this.props);
                console.log('{state}', this.state);
                console.log('{handlers}', this.handlers);
                const newHandlers = Object.assign({}, this.props.handlers, this.handlers);
                const props = Object.assign({}, this.props, this.state, { handlers: newHandlers });
                return <PrevComponent {...props} />;
            }
        };
    }, ProxyComponent);
};

export default stateToProps;

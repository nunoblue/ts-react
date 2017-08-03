import React from 'react';

const stateToProps = (mixins) => (ProxyComponent, logging) => {
    return mixins.reduce((PrevComponent, Mixin) => {
        return class extends Mixin {
            static displayName = PrevComponent.displayName || PrevComponent.name;
            render() {
                if (logging) {
                    console.log('{this}', this);
                    console.log('{props}', this.props);
                    console.log('{state}', this.state);
                    console.log('{handlers}', this.handlers);
                    console.log('{handlers.id}', this.handlers.id);
                    console.log('{name}', Mixin.name);
                }
                let newHandlers = Object.assign({}, this.props.handlers, this.handlers);
                let newProps = Object.assign({}, this.props, this.state, { handlers: newHandlers });
                if (this.handlers.id) {
                    newHandlers = Object.assign({}, this.props.handlers, { [this.handlers.id]: this.handlers });
                    newProps = Object.assign({}, this.props, this.state, { handlers: newHandlers });
                }
                return <PrevComponent {...newProps} />;
            }
        };
    }, ProxyComponent);
};

export default stateToProps;

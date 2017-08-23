import React from 'react';

const stateToProps = (mixins) => (ProxyComponent, logging) => {
    return mixins.reduce((PrevComponent, Mixin) => {
        const MixinId = typeof Mixin === 'object' ? Object.keys(Mixin)[0] : undefined;
        const MixinComponent = typeof Mixin === 'object' ? Object.values(Mixin)[0] : Mixin;
        return class extends MixinComponent {
            static displayName = PrevComponent.displayName || PrevComponent.name;
            render() {
                if (logging) {
                    console.log('{MixinId}', MixinId);
                    console.log('{this}', this);
                    console.log('{props}', this.props);
                    console.log('{state}', this.state);
                    console.log('{handlers}', this.handlers);
                    console.log('{name}', MixinComponent.name);
                }
                let newHandlers;
                let newState;
                let newProps;
                if (MixinId) {
                    newHandlers = Object.assign({}, this.props.handlers, { [MixinId]: this.handlers });
                    newState = Object.assign({}, { [MixinId]: this.state });
                    newProps = Object.assign({}, this.props, newState, { handlers: newHandlers });
                } else {
                    newHandlers = Object.assign({}, this.props.handlers, this.handlers);
                    newState = Object.assign({}, this.state);
                    newProps = Object.assign({}, this.props, newState, { handlers: newHandlers });
                }
                return <PrevComponent {...newProps} />;
            }
        };
    }, ProxyComponent);
};

export default stateToProps;

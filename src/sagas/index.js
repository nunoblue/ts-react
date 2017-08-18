import dashboards from './dashboards';

export default function* rootSaga() {
    yield [
        dashboards(),
    ];
}

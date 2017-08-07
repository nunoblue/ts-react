import { client } from '../http';
import { urlConstants } from '../constants';

const WIDGETS = urlConstants.WIDGETS;

export const getWidgets = () => (
    client.get(WIDGETS.WIDGETS_URL)
);

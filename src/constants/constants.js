import dayjs from "dayjs";

export const MAP_KEY_TREE_WITH_NAME = {
    'par_0': 'MANAGE_POLICY',
    'par_1': 'MANAGE_CATEGORY',
    'par_3': 'MANAGE_COMMENT',
    'par_4': 'MANAGE_BANNER_POPUP',
    'child_2_0': 'CREATE_NEWS',
    'child_2_1': 'APPROVE_NEWS',
    'child_2_2': 'PUBLIC_NEWS'
}

export const RANGE_TIME_DEFAULT = {
    'Hôm nay': [dayjs(), dayjs()],
    'Tháng này': [dayjs(), dayjs().endOf('month')],
};

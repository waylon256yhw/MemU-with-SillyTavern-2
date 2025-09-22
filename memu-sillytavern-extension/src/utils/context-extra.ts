import { event_types, eventSource, getMaxContextSize, saveChat } from "@silly-tavern/script.js";
import { debounce_timeout } from "@silly-tavern/scripts/constants.js";
import { promptManager, Message, MessageCollection } from "@silly-tavern/scripts/openai.js";
import { getContext } from "@silly-tavern/scripts/st-context.js";
import { debounce } from "@silly-tavern/scripts/utils.js";
import {
    MEMU_DEFAULT_FIRST_SUMMARY_FLOOR,
    MEMU_DEFAULT_SUMMARY_INTERVAL,
    MEMU_LOCAL_STORAGE_API_KEY,
    MEMU_LOCAL_STORAGE_FIRST_SUMMARY_FLOOR,
    MEMU_LOCAL_STORAGE_OVERRIDE_SUMMARIZER,
    MEMU_LOCAL_STORAGE_SUMMARY_INTERVAL,
} from "./consts";
import { MemuBaseInfo, MemuExtras, MemuRetrieve, MemuSummary } from "./types";

const originExtras: MemuExtras = {}

export const st = {
    getContext: () => getContext(),
    getChatMaxContextSize: () => getMaxContextSize(),

    saveChat: async () => await saveChat(),

    debounce: debounce,
    debounce_timeout: debounce_timeout,

    event_types: event_types,
    eventSource: eventSource,

    promptManager: promptManager,
}

export {
    Message,
    MessageCollection,
}

export const API_KEY = {
    get: () => localStorage.getItem(MEMU_LOCAL_STORAGE_API_KEY),
    set: (value: string) => localStorage.setItem(MEMU_LOCAL_STORAGE_API_KEY, value),
}

export const OVERRIDE_SUMMARIZER = {
    get: () => localStorage.getItem(MEMU_LOCAL_STORAGE_OVERRIDE_SUMMARIZER) !== 'false',
    set: (value: boolean) => localStorage.setItem(MEMU_LOCAL_STORAGE_OVERRIDE_SUMMARIZER, value.toString()),
}

function readNumberSetting(key: string, fallback: number): number {
    const raw = localStorage.getItem(key);
    if (raw == null) {
        return fallback;
    }
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
        return fallback;
    }
    return parsed;
}

function writeNumberSetting(key: string, value: number): void {
    const normalized = Math.max(1, Math.floor(value));
    localStorage.setItem(key, normalized.toString());
}

export const FIRST_SUMMARY_FLOOR = {
    get: () => readNumberSetting(MEMU_LOCAL_STORAGE_FIRST_SUMMARY_FLOOR, MEMU_DEFAULT_FIRST_SUMMARY_FLOOR),
    set: (value: number) => writeNumberSetting(MEMU_LOCAL_STORAGE_FIRST_SUMMARY_FLOOR, value),
}

export const SUMMARY_INTERVAL = {
    get: () => readNumberSetting(MEMU_LOCAL_STORAGE_SUMMARY_INTERVAL, MEMU_DEFAULT_SUMMARY_INTERVAL),
    set: (value: number) => writeNumberSetting(MEMU_LOCAL_STORAGE_SUMMARY_INTERVAL, value),
}

export const memuExtras = new Proxy<MemuExtras>(originExtras, {
    get: (_, prop) => {
        checkAndInitChatMetadata();
        switch (prop) {
            case 'baseInfo':
                return (st.getContext().chatMetadata.memuExtras as MemuExtras).baseInfo;
            case 'retrieve':
                return (st.getContext().chatMetadata.memuExtras as MemuExtras).retrieve;
            case 'summary':
                return (st.getContext().chatMetadata.memuExtras as MemuExtras).summary;
            default:
                throw new Error(`Unknown extra prop: ${String(prop)}`);
        }
    },
    set: (_, prop, value) => {
        checkAndInitChatMetadata();
        switch (prop) {
            case 'baseInfo':
                (st.getContext().chatMetadata.memuExtras as MemuExtras).baseInfo = value as MemuBaseInfo;
                return true;
            case 'retrieve':
                (st.getContext().chatMetadata.memuExtras as MemuExtras).retrieve = value as MemuRetrieve;
                return true;
            case 'summary':
                (st.getContext().chatMetadata.memuExtras as MemuExtras).summary = value as MemuSummary;
                return true;
            default:
                throw new Error(`Unknown extra prop: ${String(prop)}`);
        }
    }
})

function checkAndInitChatMetadata() {
    if (!st.getContext().chatMetadata) {
        (st.getContext() as any).chatMetadata = {};
    }
    if (!(st.getContext().chatMetadata as any).memuExtras) {
        (st.getContext().chatMetadata as any).memuExtras = {} as MemuExtras;
    }
}

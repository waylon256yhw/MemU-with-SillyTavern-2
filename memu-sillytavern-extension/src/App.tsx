import { onChatChanged, onChatCompletionPromptReady, onMessageEdited, onMessageReceived, onMessageSwiped, triggerImmediateSummary } from "memory/exports";
import { ChangeEvent, CSSProperties, useEffect, useState } from "react";
import { FailIcon, LoadingIcon, SuccessIcon } from "ui/status";
import { API_KEY, FIRST_SUMMARY_FLOOR, OVERRIDE_SUMMARIZER, SUMMARY_INTERVAL, st } from "utils/context-extra";
import { delay } from "utils/utils";

const buttonStyle: CSSProperties = {
    height: '100%',
    borderRadius: 8,
    width: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
}

const numberInputStyle: CSSProperties = {
    width: 80,
}

function normalizePositive(value: number, fallback: number): number {
    if (!Number.isFinite(value) || value <= 0) {
        return fallback;
    }
    return Math.floor(value);
}

function App() {
    const [apiKey, setApiKey] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [overrideSummarizer, setOverrideSummarizer] = useState<boolean>(false);
    const [firstSummaryFloor, setFirstSummaryFloor] = useState<number>(() => FIRST_SUMMARY_FLOOR.get());
    const [summaryInterval, setSummaryInterval] = useState<number>(() => SUMMARY_INTERVAL.get());

    useEffect(() => {
        st.eventSource.on(st.event_types.CHAT_COMPLETION_PROMPT_READY, onChatCompletionPromptReady);
        st.eventSource.on(st.event_types.CHAT_CHANGED, onChatChanged);
        st.eventSource.on(st.event_types.CHARACTER_MESSAGE_RENDERED, onMessageReceived);
        st.eventSource.on(st.event_types.MESSAGE_EDITED, onMessageEdited);
        st.eventSource.on(st.event_types.MESSAGE_SWIPED, onMessageSwiped);
    }, []);

    useEffect(() => {
        try {
            const saved = API_KEY.get();
            if (saved !== null) setApiKey(saved);
        } catch { }
    }, []);

    useEffect(() => {
        const saved = OVERRIDE_SUMMARIZER.get();
        if (saved !== null) setOverrideSummarizer(saved);
    }, []);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setApiKey(e.target.value);
        setStatus('idle');
    }

    function handleFirstSummaryFloorChange(e: ChangeEvent<HTMLInputElement>) {
        const value = normalizePositive(Number.parseInt(e.target.value, 10), firstSummaryFloor);
        setFirstSummaryFloor(value);
        FIRST_SUMMARY_FLOOR.set(value);
    }

    function handleSummaryIntervalChange(e: ChangeEvent<HTMLInputElement>) {
        const value = normalizePositive(Number.parseInt(e.target.value, 10), summaryInterval);
        setSummaryInterval(value);
        SUMMARY_INTERVAL.set(value);
    }

    function handleImmediateSummary() {
        triggerImmediateSummary();
    }

    // todo: check available
    async function handleSave() {
        setStatus('saving');
        await delay(1500);
        try {
            API_KEY.set(apiKey);
            setStatus('saved');
            await delay(1500);
            setStatus('idle');
        } catch {
            setStatus('error');
            await delay(1500);
            setStatus('idle');
        }
    }

    function handleOverrideSummarizerChange(e: ChangeEvent<HTMLInputElement>) {
        setOverrideSummarizer(e.target.checked);
        OVERRIDE_SUMMARIZER.set(e.target.checked);
    }

    return (
        <div className="memu-ext-settings">
            <div className="inline-drawer">
                <div className="inline-drawer-toggle inline-drawer-header">
                    <b>MemU Settings</b>
                    <div className="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                <div className="inline-drawer-content" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '0 4px' }}>
                        <h4>API Key</h4>
                        <small>
                            <span>get your API key from <a href="https://app.memu.so/api-key" target="_blank" rel="noopener noreferrer">here</a></span>
                        </small>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                            type="text"
                            value={apiKey}
                            onChange={handleChange}
                            className="text_pole"
                            placeholder="memu-api-key"
                        />
                        <button
                            onClick={handleSave}
                            className="menu_button"
                            style={buttonStyle}
                            disabled={status === 'saving'}
                            aria-busy={status === 'saving'}
                            title={status === 'saving' ? 'Saving' : status === 'saved' ? 'Saved' : 'Save'}
                        >
                            {status === 'saving' ? <LoadingIcon width={20} height={20} /> :
                                status === 'saved' ? <SuccessIcon width={20} height={20} /> :
                                    <i className="fa-fw fa-solid fa-save" style={{ fontSize: 20 }} />}
                        </button>
                        {status === 'error' && (
                            <FailIcon width={20} height={20} />
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <h4>Memory</h4>
                        <label className="checkbox_label expander" htmlFor="override_summarizer" title="Override Summarizer">
                            <input id="override_summarizer" type="checkbox" className="checkbox" checked={overrideSummarizer} onChange={handleOverrideSummarizerChange} />
                            <span>Override Summarizer</span>
                            <i className="fa-solid fa-info-circle" title="Override the summarizer with MemU's summarizer. Extremely recommend to be checked."></i>
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label className="checkbox_label" htmlFor="memu-first-floor" title="Trigger the first memory summary after this many messages.">
                                <span>First summary floor</span>
                                <input
                                    id="memu-first-floor"
                                    type="number"
                                    min={1}
                                    step={1}
                                    value={firstSummaryFloor}
                                    onChange={handleFirstSummaryFloorChange}
                                    className="text_pole"
                                    style={numberInputStyle}
                                />
                            </label>
                            <label className="checkbox_label" htmlFor="memu-interval" title="Trigger subsequent summaries after this many additional messages.">
                                <span>Summary interval</span>
                                <input
                                    id="memu-interval"
                                    type="number"
                                    min={1}
                                    step={1}
                                    value={summaryInterval}
                                    onChange={handleSummaryIntervalChange}
                                    className="text_pole"
                                    style={numberInputStyle}
                                />
                            </label>
                            <button
                                onClick={handleImmediateSummary}
                                className="menu_button"
                                style={{ ...buttonStyle, width: 'auto', padding: '0 12px' }}
                                title="Send the current conversation to MemU immediately and reset the summary counter."
                            >
                                <i className="fa-fw fa-solid fa-bolt" style={{ fontSize: 16, marginRight: 6 }} />
                                <span>Summarize now</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;



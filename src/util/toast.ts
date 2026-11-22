/**
 * Lightweight, dependency-free toast notifications (non-blocking replacement for window.alert).
 */
export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export interface ToastOptions {
    type?: ToastType;
    /** milliseconds; 0 keeps the toast until closed */
    duration?: number;
    action?: ToastAction;
}

const CONTAINER_ID = "cupoj-toast-container";
const STYLE_ID = "cupoj-toast-style";
const STYLE = `
#${CONTAINER_ID}{position:fixed;top:64px;right:16px;z-index:10000;display:flex;flex-direction:column;gap:8px;max-width:min(420px,calc(100vw - 32px));pointer-events:none}
#${CONTAINER_ID} .cupoj-toast{pointer-events:auto;display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:6px;background:#fff;color:#333;box-shadow:0 4px 14px rgba(0,0,0,.15);border-left:4px solid #2185d0;font-size:14px;line-height:1.5;opacity:0;transform:translateY(-6px);transition:opacity .2s,transform .2s}
#${CONTAINER_ID} .cupoj-toast.show{opacity:1;transform:none}
#${CONTAINER_ID} .cupoj-toast.success{border-left-color:#21ba45}
#${CONTAINER_ID} .cupoj-toast.warning{border-left-color:#f2711c}
#${CONTAINER_ID} .cupoj-toast.error{border-left-color:#db2828}
#${CONTAINER_ID} .cupoj-toast .msg{flex:1;white-space:pre-line;word-break:break-word}
#${CONTAINER_ID} .cupoj-toast button{border:0;background:none;cursor:pointer;padding:0;font:inherit}
#${CONTAINER_ID} .cupoj-toast .action{color:#2185d0;font-weight:600}
#${CONTAINER_ID} .cupoj-toast .close{color:#999;font-size:18px;line-height:1}
`;

function ensureContainer (): HTMLElement {
    if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = STYLE;
        document.head.appendChild(style);
    }
    let container = document.getElementById(CONTAINER_ID);
    if (!container) {
        container = document.createElement("div");
        container.id = CONTAINER_ID;
        container.setAttribute("role", "status");
        container.setAttribute("aria-live", "polite");
        document.body.appendChild(container);
    }
    return container;
}

/** Show a toast; returns a function that closes it. */
export function toast (message: string, options: ToastOptions = {}): () => void {
    const { type = "info", duration = 4000, action } = options;
    const container = ensureContainer();
    const el = document.createElement("div");
    el.className = `cupoj-toast ${type}`;
    const msg = document.createElement("span");
    msg.className = "msg";
    msg.textContent = message;
    el.appendChild(msg);

    let timer: ReturnType<typeof setTimeout> | null = null;
    let closed = false;
    const close = () => {
        if (closed) {
            return;
        }
        closed = true;
        if (timer) {
            clearTimeout(timer);
        }
        el.classList.remove("show");
        setTimeout(() => el.remove(), 200);
    };

    if (action) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "action";
        btn.textContent = action.label;
        btn.addEventListener("click", () => {
            close();
            action.onClick();
        });
        el.appendChild(btn);
    }
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "close";
    closeBtn.setAttribute("aria-label", "close");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", close);
    el.appendChild(closeBtn);

    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    if (duration > 0) {
        timer = setTimeout(close, duration);
    }
    return close;
}

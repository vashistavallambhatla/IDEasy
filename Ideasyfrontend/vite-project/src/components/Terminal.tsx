import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';

const fitAddon = new FitAddon();

function ab2str(buf: ArrayBuffer): string {
    return String.fromCharCode(...new Uint8Array(buf));
}

const OPTIONS_TERM = {
    useStyle: true,
    screenKeys: true,
    cursorBlink: true,
    cols: 200,
    theme: {
        background: "black"
    }
};

interface TerminalComponentProps {
    socket: Socket;
}

export const TerminalComponent = ({ socket }: TerminalComponentProps) => {
    const terminalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!terminalRef.current || !socket) {
            return;
        }

        socket.emit("requestTerminal");
        const term = new Terminal(OPTIONS_TERM);
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        const terminalHandler = ({ data }: { data: ArrayBuffer | string }) => {
            if (data instanceof ArrayBuffer) {
                const strData = ab2str(data);
                term.write(strData);
            }
        };

        socket.on("terminal", terminalHandler);

        term.onData((data: string) => {
            socket.emit('terminalData', { data });
        });

        socket.emit('terminalData', { data: '\n' });

        return () => {
            socket.off("terminal", terminalHandler);
        };
    }, [terminalRef, socket]);

    return <div style={{ width: "40vw", height: "400px", textAlign: "left" }} ref={terminalRef}></div>;
};

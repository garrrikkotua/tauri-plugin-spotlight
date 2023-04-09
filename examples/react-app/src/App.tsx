import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { hide } from "tauri-plugin-spotlight-api";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const handleKeydown = useCallback((event: KeyboardEvent) => {
    if (!event.ctrlKey || !event.shiftKey) return;
    if (event.key.toLowerCase() === "o") {
      void hide();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">
      <div className="row">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void greet();
          }}
        >
          <input
            id="greet-input"
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
            placeholder="Enter a name..."
            autoFocus
          />
          <button type="submit">Greet</button>
        </form>
      </div>
      <p>{greetMsg}</p>
      <button
        onClick={async () =>
          await invoke(
            "plugin:spotlight|position_window_at_the_center_of_the_monitor_with_cursor"
          )
        }
      >
        Center the app
      </button>
    </div>
  );
}

export default App;

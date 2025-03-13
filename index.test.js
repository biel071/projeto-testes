const { JSDOM } = require("jsdom");

const { expect } = require("@jest/globals");

describe("Teste de Login", () => {
    let document;
    let window;

    beforeEach(() => {
        const dom = new JSDOM(`
            <html>
                <body>
                    <input id="username" type="text">
                    <input id="password" type="password">
                    <p id="message"></p>
                    <script>
                        function login() {
                            const username = document.getElementById("username").value;
                            const password = document.getElementById("password").value;
                            const message = document.getElementById("message");
                            
                            if (username === "gab" && password === "1234") {
                                message.style.color = "green";
                                message.textContent = "Login bem-sucedido!";
                                setTimeout(() => { window.location.href = "home.html"; }, 1000);
                            } else {
                                message.textContent = "Usuário ou senha incorretos.";
                            }
                        }
                    </script>
                </body>
            </html>
        `, { runScripts: "dangerously", resources: "usable" });
        
        document = dom.window.document;
        window = dom.window;
    });

    test("Login bem-sucedido", () => {
        document.getElementById("username").value = "gab";
        document.getElementById("password").value = "1234";
        window.login();
        expect(document.getElementById("message").textContent).toBe("Login bem-sucedido!");
    });

    test("Login falha com credenciais incorretas", () => {
        document.getElementById("username").value = "errado";
        document.getElementById("password").value = "0000";
        window.login();
        expect(document.getElementById("message").textContent).toBe("Usuário ou senha incorretos.");
    });

    // test("Redirecionamento após login bem-sucedido", () => {
    //     jest.useFakeTimers();
    //     document.getElementById("username").value = "gab";
    //     document.getElementById("password").value = "1234";
    //     window.login();
    //     jest.advanceTimersByTime(1000);
    //     expect(window.location.href).toBe("http://127.0.0.1:5500/home.html");
    // });
      
});

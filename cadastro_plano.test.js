const { JSDOM } = require("jsdom");
const { expect } = require("@jest/globals");

describe("Teste de Carregamento de Dados do Cadastro", () => {
    let document;
    let window;

    beforeEach(() => {
        const dom = new JSDOM(`
            <html>
                <body>
                    <div id="dadosCadastro"></div>
                    <script>
                        function onload() {
                            const dados = localStorage.getItem("cadastro");
                            const dadosCadastro = document.getElementById("dadosCadastro");
                            if (dados) {
                                dadosCadastro.textContent = dados;
                            } else {
                                dadosCadastro.textContent = "Nenhum cadastro encontrado.";
                            }
                        }
                    </script>
                </body>
            </html>
        `, { runScripts: "dangerously", resources: "usable" });

        document = dom.window.document;
        window = dom.window;

        // Mock window.localStorage
        const localStorageMock = (function() {
            let store = {};
            return {
                getItem: function(key) {
                    return store[key] || null;
                },
                setItem: function(key, value) {
                    store[key] = value.toString();
                },
                clear: function() {
                    store = {};
                }
            };
        })();
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
        });

    });

    test("Exibe mensagem quando não há cadastro", () => {
        window.onload();
        expect(document.getElementById("dadosCadastro").textContent).toBe("Nenhum cadastro encontrado.");
    });

    test("Exibe dados do cadastro quando há cadastro", () => {
        window.localStorage.setItem("cadastro", "Nome: Teste, Idade: 30");
        window.onload();
        expect(document.getElementById("dadosCadastro").textContent).toBe("Nome: Teste, Idade: 30");
    });
});
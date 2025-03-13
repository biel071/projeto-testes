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

        // Configuração inicial do localStorage com dados
        window.localStorage.setItem("dadosCadastro", JSON.stringify({
            plano: "Premium",
            idade: "25",
            genero: "Masculino",
            salario: "5000"
        }));

        window.onload = function() {
            const dadosSalvos = JSON.parse(window.localStorage.getItem("dadosCadastro"));
            if (dadosSalvos) {
                document.getElementById("dadosCadastro").innerHTML = `
                    <strong>Plano Escolhido:</strong> ${dadosSalvos.plano} <br>
                    <strong>Idade:</strong> ${dadosSalvos.idade} anos<br>
                    <strong>Gênero:</strong> ${dadosSalvos.genero} <br>
                    <strong>Média Salarial:</strong> R$ ${dadosSalvos.salario}
                `;
            } else {
                document.getElementById("dadosCadastro").textContent = "Nenhum cadastro encontrado.";
            }
        };
    });

    test("Exibe dados do cadastro corretamente", () => {
        window.onload();
        expect(document.getElementById("dadosCadastro").innerHTML).toContain("<strong>Plano Escolhido:</strong> Premium");
        expect(document.getElementById("dadosCadastro").innerHTML).toContain("<strong>Idade:</strong> 25 anos");
        expect(document.getElementById("dadosCadastro").innerHTML).toContain("<strong>Gênero:</strong> Masculino");
        expect(document.getElementById("dadosCadastro").innerHTML).toContain("<strong>Média Salarial:</strong> R$ 5000");
    });

    test("Exibe mensagem quando não há cadastro", () => {
        window.localStorage.getItem = jest.fn(() => null);
        window.onload();
        expect(document.getElementById("dadosCadastro").textContent).toBe("Nenhum cadastro encontrado.");
    });
});
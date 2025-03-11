const { JSDOM } = require("jsdom");
const { expect } = require("@jest/globals");

describe("Teste de Confirmação de Plano", () => {
    let document;
    let window;

    beforeEach(() => {
        const dom = new JSDOM(`
            <html>
                <body>
                    <select id="plano">
                        <option value="Basico">Básico</option>
                        <option value="Premium">Premium</option>
                    </select>
                    <input id="idade" type="number">
                    <select id="genero">
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </select>
                    <input id="salario" type="number">
                    <script>
                        function confirmarPlano() {
                            const planoSelecionado = document.getElementById("plano").value;
                            const idade = document.getElementById("idade").value;
                            const genero = document.getElementById("genero").value;
                            const salario = document.getElementById("salario").value;
                            
                            const dadosCadastro = {
                                plano: planoSelecionado,
                                idade: idade,
                                genero: genero,
                                salario: salario
                            };
                            
                            localStorage.setItem("dadosCadastro", JSON.stringify(dadosCadastro));
                            alert("Cadastro realizado com sucesso!\nPlano: " + planoSelecionado);
                            window.location.href = "home.html";
                        }
                    </script>
                </body>
            </html>
        `, { runScripts: "dangerously", resources: "usable" });
        
        document = dom.window.document;
        window = dom.window;
        window.localStorage = { setItem: jest.fn() };
        window.alert = jest.fn();
    });

    test("Cadastro realizado com sucesso", () => {
        document.getElementById("plano").value = "Premium";
        document.getElementById("idade").value = "25";
        document.getElementById("genero").value = "Masculino";
        document.getElementById("salario").value = "5000";
        
        window.confirmarPlano();
        
        expect(window.localStorage.setItem).toHaveBeenCalledWith("dadosCadastro", JSON.stringify({
            plano: "Premium",
            idade: "25",
            genero: "Masculino",
            salario: "5000"
        }));
        expect(window.alert).toHaveBeenCalledWith("Cadastro realizado com sucesso!\nPlano: Premium");
    });

    test("Redirecionamento após cadastro", () => {
        document.getElementById("plano").value = "Basico";
        document.getElementById("idade").value = "30";
        document.getElementById("genero").value = "Feminino";
        document.getElementById("salario").value = "6000";
        
        window.confirmarPlano();
        
        expect(window.location.href).toBe("home.html");
    });
});

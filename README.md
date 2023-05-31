# ![](https://raw.githubusercontent.com/RinoaYK/projeto-labeddit-fullstack/aaa012e084a09ccd694a4addec5bb452670fd4ec/src/images/Logo_menor.svg) Projeto Labeddit - fullstack
Este é o repositório do **Labeddit**, um projeto final do bootcamp **FullStack Web da Labenu**. Ele consiste em duas partes separadas: o frontend ([**Labeddit**](https://labeddit-lidia-yamamura.surge.sh/)) e o backend ([**API Labeddit GitHub**](https://github.com/RinoaYK/projeto-labeddit-backend)).

O frontend é uma aplicação **React.js** desenvolvida com o Design Systems -  [**Chakra**](https://chakra-ui.com/ "Chakra UI"), que segue o conceito de **Mobile First**, onde o foco principal é direcionado para dispositivos móveis. A partir disso, é feita a adaptação para telas maiores, como tablets e desktops. Você encontrará o design detalhado no [Figma](https://www.figma.com/file/Byakv89sjTqI6NG2NRAAKJ/Projeto-Integrador-Labeddit?node-id=0%3A1&t=haX9j5M0lHbjWnAr-0), fornecendo uma referência clara para o desenvolvimento.

Inspirado na rede social **Reddit**, o **Labeddit** permite aos usuários realizar cadastro, login, visualizar posts, comentários e interagir com eles. A autenticação é implementada com JWT e os tokens são armazenados em cookies para garantir a segurança das rotas protegidas.

O backend, por sua vez, é desenvolvido com **Node.js** e utiliza o framework **Express**. Ele fornece endpoints para manipulação de usuários, posts, comentários e interações, seguindo o conceito de **CRUD** (Create, Read, Update, Delete).

Aproveite essa experiência final do bootcamp **FullStack Web da Labenu** com o **Labeddit**!


#  - Lidia Yamamura - 
Para facilitar o processo de deploy, foram criados repositórios separados para o frontend e o backend.

### Projeto frontend Labeddit : 
[**Labeddit deploy**](https://labeddit-lidia-yamamura.surge.sh/): https://labeddit-lidia-yamamura.surge.sh/


### Veja a documentação: 
[**API Labeddit deploy**](https://projeto-labeddit-backend-ust7.onrender.com):  https://projeto-labeddit-backend-ust7.onrender.com
[**API Labeddit GitHub**](https://github.com/RinoaYK/projeto-labeddit-backend): https://github.com/RinoaYK/projeto-labeddit-backend
[**API Labeddit documentação Postman**](https://documenter.getpostman.com/view/25826614/2s93m8zLhc): https://documenter.getpostman.com/view/25826614/2s93m8zLhc

<br>


## **Tecnologias Utilizadas:**

- React
- React Router
- Framer Motion
- Criação de hooks
- Integração de APIs - Axios
- Design Systems -  [Chakra](https://chakra-ui.com/ "Chakra UI")
- Autenticação e autorização (JWT)
- Cookies
- Responsividade
<br>
________________________________________________________________

### **O projeto consiste em:**

 - **Gerais:**
	- A aplicação utiliza a api:
		- [**API Labeddit**](https://projeto-labeddit-backend-ust7.onrender.com)
	- O site tem 5 páginas principais:
		- Login, Signup, Posts, Comments e User;	
	- Contém 1 página de erro que é redirecionado caso ocorra um erro.		
	- O projeto segue o [design](https://www.figma.com/file/Byakv89sjTqI6NG2NRAAKJ/Projeto-Integrador-Labeddit?node-id=0%3A1&t=haX9j5M0lHbjWnAr-0 "design") proposto;	
	

- **Página Login:**
	- Página principal onde é possível o usuário logar na aplicação.
	-É possível selecionar o checkbox "Remeber Me" para salvar os dados de login. Se retirar o check, os dados  são removidos.
	-  Possui um botão  para logar e um botão para ir para a página de Cadastro.
	- **Atenção!!** Para logar, o usuário precisa ter se cadastratado.

- **Página Cadastro:**
	- Nessa página o usúario pode realizar o cadastro.
	- Contém 3 campos de input, onde devem ser preenchidos: 	
		- nickname, email e senha.
	- Contém um botão para efetuar o cadastro e um para voltar pro  login.
	- Possui verificação, caso não preencha com campos válidos.

- **Página de Posts:**
	- No Header, contém um botão a esquerda onde é  possível ver o avatar e nickname do usuário e leva para a página de edição de usuário.
	- A direita no Header, contém um botão para o sair da conta.
	- Ao descer/subir a página aparece um ícone para mover pro final ou início da página.
	- Possui um filtro para selecionar os posts em ordem dos mais curtidos ou de data de criação/alteração mais recente.
	- Contém cards com os posts dos usuários, é possível editar ou deletar o post que você mesmo criou.
	- Não é possível postar um post com o mesmo conteúdo que você já tenha enviado.
	- É possível curtir ou descurtir um post, mas não é possível nos que você mesmo criou.
	- Em cada card de post, no ícone de mensagem ao lado das setas de curtidas, onde é visualizado a quantidade de comentários, é possível ir para os comentários relacionados àquele post.
	- **Atenção!!** Se você deletar um post, todos os comments relacionados serão excluídos automaticamente.


- **Página de Comments:**
	- No Header, contém um botão a esquerda que fecha os comentários e volta para os posts.
	- A direita no Header, contém um botão para o sair da conta.
	- Ao descer/subir a página aparece um ícone para mover pro final ou início da página.
	- Possui um filtro para selecionar os comments em ordem dos mais curtidos ou de data de criação/alteração mais recente.	
	- Não é possível postar um comment com o mesmo conteúdo que você já tenha enviado.
	- É possível curtir ou descurtir um comment ou post, mas não é possível nos que você mesmo criou.
	- Contém cards com os comments dos usuários do post selecionado, é possível editar ou deletar o comment ou post que você mesmo criou.
	- **Atenção!!** Se você deletar um post, todos os comments relacionados serão excluídos automaticamente.

- **Página User:**
	- Nessa página é possível alterar as informações do usuário cadastrado:
		- nickname, email, senha ou avatar.
	-  Contém um botão a esquerda no Header para fechar a edição e voltar a página de posts.
	- **Atenção!!** No input avatar, ao se cadastrar, inicia com uma imagem default de usuário, para ser alterado, deve ser colocado um link de imagem válido.

- **Página de Erro:**
	- Contém um botão para retornar ao Login;
<br>

## O layout da página:

![](https://raw.githubusercontent.com/RinoaYK/projeto-labeddit-fullstack/main/Labeddit-frontend.gif)

### Instalação:

```bash
# Instale todas as dependências
$ npm install

# Execute o projeto
$ npm run start
```

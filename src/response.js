const messageBot = require('./message')
const envDoc = require('./docments')
const { getState, setState } = require('./state');

let state_product = '';

const funcMessage = {
    async Welcome(chat) {
        const welcomeMessage = messageBot.boasVindas

        await chat.sendMessage(welcomeMessage);

        console.log(`bot message:\n ${welcomeMessage}`);
        setState('ask_issue');
    },

    async askIssue(chat, issue) {
        userChoice = issue.trim();

        switch (userChoice) {
            case '1':
                await funcMessage.buyProducts(chat);
                break;

            case '2':
                await funcMessage.technicalSupport(chat);
                break;

            case '3':
                await funcMessage.orderInformation(chat);
                break;

            case '4':
                await funcMessage.transferToAgent(chat);
                break;

            default:
                const errorMessage = messageBot.erroMessage
                await chat.sendMessage(errorMessage);

                console.log(`Sent message: ${errorMessage}`);

                setState('ask_issue');
                console.log(`state = ${getState}`)
                break;
        }
    },

    async buyProducts(chat) {
        const buyMessage = messageBot.buyMessage;
        await chat.sendMessage(buyMessage);

        console.log(`bot message:\n ${buyMessage}`);

        setState('provide_solution');
        state_product = 'provide_solution_products';
        console.log(`state = ${getState()}`);
        console.log(`state = ${state_product}`)
    },

    async technicalSupport(chat) {
        const supportMessage = messageBot.supportMessage;
        await chat.sendMessage(supportMessage);

        console.log(`bot message:\n ${supportMessage}`);

        setState('provide_solution');
        state_product = 'provide_solution_support';
        console.log(`state = ${getState()}`);
        console.log(`state = ${state_product}`)
    },

    async orderInformation(chat) {
        const orderMessage = messageBot.orderMessage;
        await chat.sendMessage(orderMessage);

        console.log(`bot message:\n ${orderMessage}`);

        setState('provide_solution');
        state_product = 'provide_solution_orders';
        console.log(`state = ${getState()}`);
        console.log(`setState = ${state_product}`)
    },

    async transferToAgent(chat) {
        const agentMessage = messageBot.agentMessage;
        await chat.sendMessage(agentMessage);

        console.log(`bot message:\n ${agentMessage}`);

        setState('end');
        console.log(`state = ${getState()}`);
    },

    async provideSolution(chat, response) {
        switch (state_product) {
            case 'provide_solution_products':
                await this.handleProductCategories(chat, response);
                console.log(`state_product = ${state_product}`)
                break;
            case 'provide_solution_support':
                await this.handleTechnicalSupport(chat, response);
                console.log(`state_product = ${state_product}`)
                break;
            case 'provide_solution_orders':
                await this.handleOrderStatus(chat, response);
                console.log(`state_product = ${state_product}`)
                break;
        }
    },

    async handleProductCategories(chat, response) {
        let categoryMessage;

        switch (response) {
            case '1':
                envDoc(chat, response, './doc/you.pdf');
                state_product = '';
                break;
            case '2':
                categoryMessage = messageBot.categoryclothes;
                state_product = '';
                break;
            case '3':
                categoryMessage = messageBot.categoryfoods;
                state_product = '';
                break;
            case '4':
                setState('Welcome');
                state_product = '';
                await this.Welcome(chat);
                return;
            default:
                categoryMessage = messageBot.productErroMessage;
                state_product = '';
                break;
        }

        await chat.sendMessage(categoryMessage);

        console.log(`bot message:\n ${categoryMessage}`);
    },

    async handleTechnicalSupport(chat, response) {
        let supportMessage;

        switch (response) {
            case '1':
                supportMessage = messageBot.supportconnectivity;
                state_product = '';
                break;
            case '2':
                supportMessage = messageBot.supportproduct;
                state_product = '';
                break;
            case '3':
                supportMessage = messageBot.supportsettings;
                state_product = '';
                break;
            case '4':
                setState('Welcome');
                await this.Welcome(chat);
                return;
            default:
                supportMessage = messageBot.technicalErroMessage;
                state_product = '';
                break;
        }

        await chat.sendMessage(supportMessage);

        console.log(`bot message:\n ${supportMessage}`);
    },

    async handleOrderStatus(chat, response) {
        const orderStatusMessage = `Verificando o status do pedido ${response}. Por favor, aguarde um momento.`;
        state_product = '';
        await chat.sendMessage(orderStatusMessage);

        console.log(`bot message:\n ${orderStatusMessage}`);
    },

    async endSupportConversation(chat) {
        const endMessage = messageBot.endMessage
        await chat.sendMessage(endMessage);
        state_product = '';

        console.log(`bot message:\n ${endMessage}`);

        setState('Welcome');
    }
}

module.exports = funcMessage;
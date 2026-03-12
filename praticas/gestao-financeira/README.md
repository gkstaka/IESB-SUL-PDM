# 💻 Aula 06: Listagem de Transações (FlatList e Estilização Dinâmica)

Até agora, nosso aplicativo salva as transações na memória de forma invisível. Nesta aula, vamos dar vida à aba principal do aplicativo, criando uma lista elegante para exibir todas as movimentações financeiras. Aprenderemos a formatar dados na tela, criar estilos condicionais (renda verde, gastos vermelhos) e lidar com listas vazias.

## 🎯 Objetivos da Aula
* Utilizar o componente `<FlatList>` para renderizar listas otimizadas.
* Criar um componente isolado para o item da lista (`TransactionItem`).
* Criar um componente dinâmico de ícones (`CategoryItem`) baseado na categoria.
* Aplicar estilização condicional (cores diferentes dependendo do tipo de transação).
* Formatar datas e valores monetários para o padrão brasileiro (`pt-BR`).
* Usar a propriedade `ListEmptyComponent` da FlatList.

---

## 🎨 Passo 1: Atualizando os Estilos Globais
Antes de construir os componentes, precisamos de novas cores e padrões de texto no nosso arquivo `styles/globalStyles.js`. Adicione as classes de linhas e textos primários/secundários:

```javascript
// Adicione isto ao seu StyleSheet.create no globalStyles.js
  line: {
    backgroundColor: colors.secondaryText,
    height: 1,
    opacity: 0.5,
    marginBottom: 4
  },
  primaryText: {
    fontSize: 16,
    color: colors.primaryText
  },
  secondaryText: {
    fontSize: 12,
    color: colors.secondaryText
  },
  positiveText: {
    fontSize: 16,
    color: colors.positiveText // Verde
  },
  negativeText: {
    fontSize: 16,
    color: colors.negativesText // Vermelho
  },
  ```
 ## 🔣 Passo 2: O Ícone Dinâmico (CategoryItem)
Cada transação terá um ícone redondo do lado esquerdo. A cor e o desenho do ícone mudam dependendo da categoria (Alimentação, Casa, etc.).
Crie o arquivo `components/CategoryItem.jsx`:
```jsx
import { View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { categories } from "../constants/categories";
import { colors } from "../constants/colors";

export default function CategoryItem({ category }) {
  // Acessa as configurações da categoria (ex: categories["food"])
  const currentCategory = categories[category];

  return (
    <View style={[styles.background, { backgroundColor: currentCategory.background }]}>
      <MaterialIcons name={currentCategory.icon} size={24} color={colors.primaryContrast} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  }
});
```
## 💳 Passo 3: O Item da Transação (`TransactionItem`)
Agora vamos montar a "linha" completa da transação, exibindo o ícone, a descrição, a data e o valor formatado. Note a lógica condicional (`valueStyle`) que decide se o texto do dinheiro será verde (renda) ou vermelho (gasto).

Crie o arquivo `components/TransactionItem.jsx`:

```jsx
import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import CategoryItem from "./CategoryItem";
import { categories } from "../constants/categories";

export default function TransactionItem({ category, date, description, value }) {
  // Define a cor do texto do valor com base na categoria
  const valueStyle = category === categories.income.name
      ? globalStyles.positiveText
      : globalStyles.negativeText;

  return (
    <>
      <View style={styles.itemContainer}>
        <CategoryItem category={category} />
        
        <View style={styles.textContainer}>
          {/* Data formatada para pt-BR */}
          <Text style={globalStyles.secondaryText}>
            {new Date(date).toLocaleDateString("pt-BR")}
          </Text>
          
          <View style={styles.bottomLineContainer}>
            <Text style={globalStyles.primaryText}>{description}</Text>
            
            {/* Valor formatado como Moeda */}
            <Text style={valueStyle}>
              {value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
        </View>
      </View>
      {/* Linha divisória entre os itens */}
      <View style={globalStyles.line} />
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4,
  },
  textContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
    paddingVertical: 8,
  },
  bottomLineContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
```
## 📋 Passo 4: A Tela Principal com FlatList
Finalmente, vamos até a nossa tela inicial (`app/(tabs)/index.jsx`) buscar os dados do nosso `MoneyContext` e passá-los para a `FlatList`.

**Por que a FlatList é incrível?** Ela possui a propriedade `ListEmptyComponent`, que permite exibir um texto amigável (ex: "Ainda não há nenhum item!") caso o usuário tenha acabado de instalar o aplicativo e a lista esteja vazia.

```jsx
import { MoneyContext } from "../../contexts/GlobalState";
import { useContext } from "react";
import { FlatList, Text, View } from "react-native";
import TransactionItem from "../../components/TransactionItem";
import { globalStyles } from "../../styles/globalStyles";

export default function Transactions() {
  const [transactions] = useContext(MoneyContext);

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={transactions}
        // Desestrutura o item atual e passa todas as suas propriedades para o TransactionItem
        renderItem={({ item }) => <TransactionItem {...item} />}
        keyExtractor={(item, index) => index.toString()} // Importante para evitar avisos no console
        
        // Componente exibido quando o array de dados está vazio
        ListEmptyComponent={
          <Text style={globalStyles.secondaryText}>
            Ainda não há nenhum item!
          </Text>
        }
        style={globalStyles.content}
      />
    </View>
  );
}
```
💡 **Dica de Debug (Limpando o AsyncStorage)**
Se você adicionou dados incorretos no passado (por exemplo, quando a data estava salva como texto simples em vez de objeto) e o aplicativo estiver fechando sozinho (`Crash`) ao tentar carregar a lista, você precisará limpar a memória do celular.
Basta ir no seu `GlobalState.jsx` e colocar um `AsyncStorage.clear()` temporariamente dentro do seu `useEffect`, rodar o app uma vez e depois retirar o comando.

✅ **O que alcançamos hoje?**
Sua aba principal agora parece um aplicativo de banco profissional! As listas são renderizadas eficientemente, com formatação de moeda perfeita, formatação de datas nativa e cores condicionais para orientar visualmente o usuário sobre ganhos e despesas.

**Próximo Passo:** Na próxima (e última) grande aula, vamos fechar com chave de ouro criando a **Aba de Resumo**, agrupando esses dados matematicamente para gerar estatísticas!
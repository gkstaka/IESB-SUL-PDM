# 💻 Aula 07: Tela de Resumo, Lógica de Totais e Otimização com `useMemo`

Chegamos à última tela do nosso aplicativo! A aba de "Resumo" será responsável por pegar todas as transações cadastradas, separá-las por categorias, somar os valores e exibir o saldo final (positivo ou negativo). Faremos isso com foco em **performance**, garantindo que o celular não trave mesmo se houver milhares de transações.

## 🎯 Objetivos da Aula
* Criar o componente `SummaryItem` para exibir o total de cada categoria.
* Desenvolver um algoritmo otimizado (O(n)) para somar valores sem repetir loops.
* Utilizar o Hook `useMemo` para evitar recálculos desnecessários e melhorar a performance.
* Exibir o saldo final com cores condicionais (verde para positivo, vermelho para negativo).
* Desafio final: Dicas de como evoluir o app para o seu portfólio!

---

## 🧩 Passo 1: O Componente `SummaryItem`
Este componente é muito parecido com o item da lista de transações, mas é mais enxuto: ele não mostra a data e exibe apenas a categoria e o valor total acumulado.

Crie o arquivo `components/SummaryItem.jsx`:

```javascript
import { StyleSheet, Text, View } from "react-native";
import CategoryItem from "./CategoryItem";
import { categories } from "../constants/categories";
import { globalStyles } from "../styles/globalStyles";

export default function SummaryItem({ category, value }) {
  // Define se o texto do valor será verde (renda) ou vermelho (gasto)
  const valueStyle = category === categories.income.name
      ? globalStyles.positiveText
      : globalStyles.negativeText;

  return (
    <View style={styles.itemContainer}>
      <CategoryItem category={category} />
      <View style={styles.textContainer}>
        <Text style={globalStyles.primaryText}>
          {categories[category].displayName}
        </Text>
        <Text style={valueStyle}>
          {value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </View>
    </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 12,
  },
});
```
## 🧠 Passo 2: A Tela de Resumo e a Lógica Otimizada
Para somar os valores, poderíamos usar a função `reduce` várias vezes (uma para cada categoria). Porém, passar pelo array inteiro 5 vezes é ruim para a performance.

Em vez disso, vamos usar a técnica de **HashMap**: criamos um objeto com os totais zerados e passamos pelo array de transações **apenas uma vez** (`for`), distribuindo os valores nas "caixinhas" corretas.

Abra o arquivo `app/(tabs)/summary.jsx`:
```js
import { useContext, useMemo } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import { categories } from "../../constants/categories";
import { globalStyles } from "../../styles/globalStyles";
import SummaryItem from "../../components/SummaryItem";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

export default function Summary() {
  const [transactions] = useContext(MoneyContext);

  // Função que calcula todos os totais passando pela lista UMA única vez
  const getTotals = () => {
    const totals = {
      sum: 0,
      income: 0,
      food: 0,
      education: 0,
      house: 0,
      travel: 0,
    };

    for (let i = 0; i < transactions.length; i++) {
      const item = transactions[i];

      // Soma o valor na categoria específica
      totals[item.category] += item.value;

      // Atualiza o Saldo Geral (soma se for renda, subtrai se for gasto)
      if (item.category === categories.income.name) {
        totals.sum += item.value;
      } else {
        totals.sum -= item.value;
      }
    }
    return totals;
  };

  /* * A MÁGICA DA PERFORMANCE (useMemo):
   * O React só vai executar a função getTotals de novo se o array [transactions] mudar!
   * Isso evita cálculos pesados em renderizações desnecessárias da tela.
   */
  const totals = useMemo(getTotals, [transactions]);

  // Define a cor do Saldo Final
  const valueStyle = totals.sum > 0 ? globalStyles.positiveText : globalStyles.negativeText;

  return (
    <View style={globalStyles.screenContainer}>
      <View style={globalStyles.content}>
        
        {/* Renderiza os Itens de Resumo */}
        <SummaryItem category={categories.income.name} value={totals[categories.income.name]} />
        <SummaryItem category={categories.food.name} value={totals[categories.food.name]} />
        <SummaryItem category={categories.house.name} value={totals[categories.house.name]} />
        <SummaryItem category={categories.education.name} value={totals[categories.education.name]} />
        <SummaryItem category={categories.travel.name} value={totals[categories.travel.name]} />
        
        <View style={globalStyles.line} />
        
        {/* Renderiza o Saldo Final */}
        <View style={styles.balance}>
          <Text style={styles.balanceText}>Saldo</Text>
          <Text style={valueStyle}>
            {totals.sum.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balance: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  balanceText: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: "800",
  },
});
```
## 🚀 Desafio Final: Destaque-se no seu Portfólio!
Aplicativos clonados exatamente iguais aos de cursos não chamam tanta atenção de recrutadores. Agora que você tem a base sólida e o aplicativo rodando perfeitamente, **coloque a sua cara nele!** Aqui estão algumas sugestões de como evoluir esse app para o seu portfólio do GitHub:

1. **Filtro de Mês/Ano:** Na tela inicial e de resumo, adicione um botão para filtrar as transações apenas do mês atual.
2. **Gráficos Visuais:** Na tela de Resumo, substitua (ou complemente) os textos por um gráfico de pizza (PieChart), mostrando a porcentagem de gastos por categoria.
3. **Edição e Exclusão:** Permita que o usuário clique e segure (onLongPress) em uma transação na lista para abrir um modal de exclusão ou edição.
4. **Categorias Customizadas:** Permita que o usuário crie novas categorias além das 5 originais.

✅ **O que alcançamos hoje?**
Fechamos o ciclo! O App "Money" agora é um aplicativo financeiro completo, com controle de formulários avançado, navegação em abas, salvamento persistente, listagens dinâmicas e cálculos otimizados com `useMemo`.

**Próximo Passo:** Na nossa última aula bônus, conversaremos sobre como preparar esse aplicativo para publicação e gerar um `.apk` para instalarmos de verdade no celular!
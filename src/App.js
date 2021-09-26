import './App.css';
import StarWars from './component/starwars';
import { client } from "./ApolloClient/client";
import { ApolloProvider } from '@apollo/client';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <StarWars />
      </div>
    </ApolloProvider>
  );
}

export default App;

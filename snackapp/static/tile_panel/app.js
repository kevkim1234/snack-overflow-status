//==============================================================================
//
//                               React Elements
//
//==============================================================================

/*
Tile generates this HTML:

<article class={ this.props.articleClass }>
  <span class={ this.props.spanClass }>
    <img src={ this.props.imgSrc } alt={ this.props.imgAlt } />
  </span>
  <a href={ this.props.link }>
    <h2>{ this.props.name }</h2>
    <div class={ this.props.divClass }>
      <p>{ this.props.description }</p>
    </div>
  </a>
</article>
*/
var Tile = React.createClass({

  displayName: "Tile",

  render: function() {
    var ref = this.props; // don't like writing "this.props" everytime
    return React.createElement("article", { className: ref.articleClass },
      React.createElement("span", { className: ref.spanClass },
        React.createElement("img", { src: ref.imgSrc, alt: ref.imgAlt })
      ),
      React.createElement("a", { href: ref.link },
        React.createElement("h2", {}, ref.name),
        React.createElement("div", { className: ref.divClass },
          React.createElement("p", {}, ref.description)
        )
      )
    );
  }
});

/*
TilePanel generates this HTML:

<section class="tiles">
  <Tile props=this.props.tiles[0]></Tile>
  <Tile props=this.props.tiles[1]></Tile>
  <Tile props=this.props.tiles[2]></Tile>
  ...
</section>
*/
var TilePanel = React.createClass({

  displayName: "TilePanel",

  render: function() {
    return React.createElement("section", { className: "tiles" },
      this.props.tiles.map(function(tile) {
        // the fields of 'tile' become the props of 'this' in Tile
        return React.createElement(Tile, tile);
      })
    );
  }
});

/*
HeaderIntro generates this HTML:
<header>
  <h1>{ this.props.title }</h1>
  <p>{ this.props.subText }</p>
</header>
*/
var HeaderIntro = React.createClass({

  displayName: "HeaderIntro",

  render: function() {
    return React.createElement("header", {},
      React.createElement("h1", {}, this.props.name),
      React.createElement("p", {}, this.props.desc)
    );
  }
});

var SearchBox = React.createClass({

  doSearch: function() {
    var query = ReactDOM.findDOMNode(this.refs.searchInput).value; // this is the search text
    this.props.doSearch(query);
  },

  render: function() {
    return React.createElement("form", { method: "post", action: "#" },
      React.createElement("div", { className: "row uniform" },
        React.createElement("div", { className: "6u 12u$(xsmall)" },
          React.createElement("input", { type: "text", ref: "searchInput", placeholder: "Search Name", value: this.props.query, onChange: this.doSearch })
        )
      )
    );
  }
});

/*
App generates this HTML:

<div class="inner">
  <HeaderIntro props={ title: }></HeaderIntro>
  <TilePanel></TilePanel>
</div>
*/
var App = React.createClass({

  displayName: "App",

  doSearch: function(queryText) {
    console.log(queryText)

    // get query result
    var queryResult = [];
    this.props.data.forEach(function(product) {
      // can also look at other product properties...
      if (product.name.toLowerCase().indexOf(queryText) != -1) {
        queryResult.push(product);
      }
    });

    this.setState({
      query: queryText,
      filteredData: queryResult
    })
  },

  getInitialState: function() {
    return {
      query: '',
      filteredData: this.props.data
    }
  },

  render: function() {
    return React.createElement("div", { className: "inner" },
      React.createElement(HeaderIntro, this.props.appInfo),
      React.createElement("section", {},
        React.createElement("h2", {}, "Search the Snack Overflow inventory"),
        React.createElement(SearchBox, { query: this.state.query, doSearch: this.doSearch })
      ),
      React.createElement(TilePanel, { tiles: this.state.filteredData })
    );
  }
});

//==============================================================================
//
//                                  App Data
//
//==============================================================================

// given an object with a 'key' and 'stock' field and a nonnegative number,
// returns an object containing all the data needed for generating a Tile
function tileData(datum, index) {
  var imgNum = Math.floor(index % 12 + 1),
      styleNum = Math.floor(index % 6 + 1);
  return {
    name: datum.key,
    description: datum.stock + " in stock",
    imgSrc: "../../static/images/pic" + (imgNum > 9 ? "" : "0") + imgNum + ".jpg",
    imgAlt: "image #" + imgNum,
    link: "item_chart.html#chart",    // useful with real data???
    articleClass: "style" + styleNum, // color on mouseout
    spanClass: "image",               // probably don't need this
    divClass: "content"               // probably don't need this
  };
}

// the app's name and description
var appInfo = {
  name: "This. Is. Snack Overflow Status.",
  desc: "Leaders of innovation. Masters of greatness. Snack Overflow Status is "
      + "at the pinnacle of tenacious and awesome. Welcome to the most "
      + "immersive snack-tracking experience you will ever have."
};

// construct the products from the data array in data.js
var products = data.map(tileData);

//==============================================================================
//
//                                App Rendering
//
//==============================================================================

ReactDOM.render(
  React.createElement(App, { appInfo: appInfo, data: products }),
  document.getElementById("main") // renders the app inside #main
);

<?php
require "mysql_connect.php";

$sql = "SELECT * FROM search_data";
$result = $conn->query($sql);
$string="[";

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $string = $string."{ label: \"" . $row["label"].
        "\", category: \"" .  $row["category"] . 
        "\", description: \"" . $row["description"].  "\"},";
    }
}


$string = $string."]";

$conn->close();
?>

<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>jQuery UI Custom Autocomplete</title>
	<link rel="stylesheet" type="text/css" href="stylesheet.css">

	<link rel="stylesheet" href="jquery-ui.css">
	<script src="jquery-1.11.3.js"></script>
	<script src="jquery-ui.js"></script>
	<script>
		function myAutoCompleteWidgetConstructor() {
			this._super();
		};
		function renderAutoCompleteMenuItem(ul, item) {
			terms = this.term.split(',');
			term = terms[terms.length - 1].trim();

			var letters = /^[0-9a-zA-Z]+$/;
			if (!letters.test(term)) {
				$("#alert").html('Please input alphanumeric characters only');
				return;
			}
			else
				$("#alert").html('');
			
			term = term.toLowerCase();
			var re = new RegExp(term, 'g') ;
			replace = re.exec(term);
			var t = item.label.replace(re,"</span><span class='match-character'>" + replace + "</span><span class='remainingch'>");
			var b = "<span class='remainingch'>";
			var e = "</span>";
			var i = b.concat(t);
			var ii = i.concat(e);
			return $( "<li></li>" )
			.data( "item.autocomplete", item )
			.append( "<a>" + ii + "</a>" )
			.appendTo( ul );
		};
		function renderAutoCompleteMenu(ul, items) {
			var that = this;
					currentCategory = "";
  			$.each( items, function( index, item ) {
  				var li;
  				if (item.category != currentCategory){
 					ul.append( "<li class='category'>" + item.category + "</li>" ); 				
 					currentCategory = item.category;
  				}
  				$("#alert").html("item.category");
  				li = that._renderItemData( ul, item );
				if ( item.category ) {
					li.attr( "aria-label", item.category + " : " + item.label );
				}
  			});
  		};
		$.widget( "custom.myautocomplete", $.ui.autocomplete, {
			_create: myAutoCompleteWidgetConstructor,
			_renderItem: renderAutoCompleteMenuItem,
			_renderMenu: renderAutoCompleteMenu
		});
	</script>
	<script>
		var input_data = <?php echo $string; ?>;

		function split( val ) {
			return val.split( /,\s*/ );
		}
		function extractLast( term ) {
			return split( term ).pop();
		}
		function onDocumentReady() {
			$( "#search" )
			.on( "keydown", function( event ) {
				if ( event.keyCode === $.ui.keyCode.TAB &&
						$( this ).autocomplete( "instance" ).menu.active ) {
					event.preventDefault();
				}
			})
			.myautocomplete({
				delay: 0,
				source: function( request, response ) {
					response( $.ui.autocomplete.filter(
						input_data, extractLast( request.term ) ) );
				},
				focus: function() {
					return false;
				},
				select: function( event, ui ) {
					var terms = split( this.value );
					terms.pop();
					terms.push( ui.item.value );
					terms.push( "" );
					this.value = terms.join( ", " );
					$( "#alert" ).html( ui.item.description );
					return false;
				}
				
				});
		};
		$( document ).ready(onDocumentReady);
	</script>
</head>
<body>
	<div style="height:150px">
		<p>Search items in the database here</p>
		<label for="search">Search: </label>
		<input id="search">
		<p id="alert"></p>
	</div>
	<br/>
	<div>
	<form action="additem.php" method="post">
		<span class="text">Submit your own item to the database!</span>
		<br/><br/>
        <table border="0" cellspacing="5" cellpadding="0">
            <tr>
            	<td class="text">item name:</td>
                <td><input type="text" name="name" id="name" style= "width: 150px" /></td>
            </tr>
            <tr>
                <td class="text">item category:</td>
                <td><input type="text" name="category" id="category" style= "width: 150px" /></td>
            </tr>
            <tr>
            	<td class="text">item description:</td>
                <td><textarea class="text" type="text" name="description" id="description" rows="10" cols="30"></textarea></td>
            </tr>
        </table>
		<br/>
        <input type="submit" value="Submit" style="width: 200px;font-size: 18px" />
    </form>
    </div>
</body>
</html>

describe("Alkanes", function() {
  var bonds = [];
  var atoms = [];
  var molecules = {};
  var tempMol
  var moleculeName

  
  beforeEach(function(done) {
    $.getJSON("spec/OrganicMolecules/alkanes.json", function(json) {
        molecules = json;
        done();
    });
  });

  
  describe("single chain alkane", function() {
    it("methane", function() {
      tempMol = molecules['methane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('methane');
    });

    it("ethane", function() {
      tempMol = molecules['ethane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('ethane');
    });

    it("propane", function() {
      tempMol = molecules['propane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('propane');
    });

    it("butane", function() {
      tempMol = molecules['butane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('butane');
    });

    it("pentane", function() {
      tempMol = molecules['pentane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('pentane');
    });

    it("hexane", function() {
      tempMol = molecules['hexane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('hexane');
    });

    it("heptane", function() {
      tempMol = molecules['heptane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('heptane');
    });

    it("octane", function() {
      tempMol = molecules['octane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('octane');
    });

    it("nonane", function() {
      tempMol = molecules['nonane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('nonane');
    });

    it("decane", function() {
      tempMol = molecules['decane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('decane');
    });
  });

  /*describe("single chain alkane", function() {
    it("methane", function() {
      tempMol = molecules['methane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('methane');
    });

    it("ethane", function() {
      tempMol = molecules['ethane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('ethane');
    });

    it("propane", function() {
      tempMol = molecules['propane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('propane');
    });

    it("butane", function() {
      tempMol = molecules['butane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('butane');
    });

    it("pentane", function() {
      tempMol = molecules['pentane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('pentane');
    });

    it("hexane", function() {
      tempMol = molecules['hexane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('hexane');
    });

    it("heptane", function() {
      tempMol = molecules['heptane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('heptane');
    });

    it("octane", function() {
      tempMol = molecules['octane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('octane');
    });

    it("nonane", function() {
      tempMol = molecules['nonane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('nonane');
    });

    it("decane", function() {
      tempMol = molecules['decane'];
      moleculeName = orgo(tempMol.nodes, tempMol.links);
      expect(moleculeName).toEqual('decane');
    });
  });*/

  /*// demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(function() {
        player.resume();
      }).toThrowError("song is already playing");
    });
  });*/
});

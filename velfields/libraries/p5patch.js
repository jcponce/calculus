////////////////////////////////////////////
//
// a couple of (serious) bugfixes, which tackle precission, math and fail implementations, memory management and other stuff.
// p5 v0.5.16
//
////////////////////////////////////////////

p5.prototype.loadPixels = function() {
  this._renderer.loadPixels.apply(this._renderer, arguments);
};







p5.Vector.cross = function cross(a, b, dst) {
  dst = dst || new p5.Vector();
  dst.x = a.y * b.z - a.z * b.y;
  dst.y = a.z * b.x - a.x * b.z;
  dst.z = a.x * b.y - a.y * b.x;
  return dst;
};


p5.Vector.prototype.normalize = function normalize() {
  
  var x = this.x;
  var y = this.y;
  var z = this.z;
  
  var mag = x * x + y * y + z * z; // squared
  // only normalize of length not is 0 or 1
  if(mag !== 1.0 && mag !== 0.0){
    mag = 1.0 / Math.sqrt(mag);
    x *= mag;
    y *= mag;
    z *= mag;
  }
  
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
};




p5.Geometry.prototype._getFaceNormal = function(faceId, normal) {
 
  // face data
  var face = this.faces[faceId];
  var vA = this.vertices[face[0]];
  var vB = this.vertices[face[1]];
  var vC = this.vertices[face[2]];
  
  // reuse existing 
  this.tmp_ab = this.tmp_ab || new p5.Vector();
  this.tmp_ac = this.tmp_ac || new p5.Vector();
  normal = normal || new p5.Vector();
  
  // base
  var ab = this.tmp_ab.set(vB).sub(vA);
  var ac = this.tmp_ac.set(vC).sub(vA);

  // check for zero length
  var mag_ab = ab.magSq();
  var mag_ac = ac.magSq();
  if(mag_ab === 0.0 || mag_ac === 0.0){
    return normal.set(0,0,0);
  }
  
  // cross product
  normal = p5.Vector.cross(ab, ac, normal);

  // length adjustment
  // var mag = normal.mag();
  // mag_ab = Math.sqrt(mag_ab);
  // mag_ac = Math.sqrt(mag_ac);
  // var alpha = mag / (mag_ab * mag_ac);
  // normal.mult(Math.asin(alpha) / mag);
  
  // normalize
  normal.normalize();
  
  return normal;
};



p5.Geometry.prototype.computeNormals = function() {
  
  var verts = this.vertices;
  var faces = this.faces;

  var num_verts = verts.length;
  var num_faces = faces.length;
  
  
  // 1) init list of face id's for each vertex
  this.vert_facelist = this.vert_facelist || [];
  for (var vi = 0; vi < num_verts; vi++) {
    this.vert_facelist[vi] = [];
  }
  
  // 2) precompute face-normals
  //    create list of face id's for each vertex
  this.facenormals = this.facenormals || [];
  for (var fi = 0; fi < num_faces; fi++) {
    this.facenormals[fi] = this._getFaceNormal(fi, this.facenormals[fi]);
    this.vert_facelist[faces[fi][0]].push(fi);
    this.vert_facelist[faces[fi][1]].push(fi);
    this.vert_facelist[faces[fi][2]].push(fi);
  }
  
  // create vertex normal by averaging adjacent face-normals.
  this.vertexNormals = this.vertexNormals || [];
  for (var vi = 0; vi < num_verts; vi++) {

    // reuse existing
    var normal = this.vertexNormals[vi];
    if(normal){
      normal.set(0,0,0);
    } else {
      normal = new p5.Vector();
    }
    // iterate through all adjacent faces and sum up face normals
    var face_ids = this.vert_facelist[vi];
    var num_face_ids = face_ids.length;
    for (var k = 0; k < num_face_ids; k++) {
      var fi = face_ids[k];
      normal.add(this.facenormals[fi]);
    }
    // each normal was normalized, so we can ust divide by the count
    normal.mult(1.0 / num_face_ids); 
    // normal.normalize();
    this.vertexNormals[vi] = normal;
  }
  
  return this;
};





p5.RendererGL.prototype._edgesToVertices = function(geom) {

  var verts = geom.vertices;
  var edges = geom.edges;
  
  var edge;
  var vA, vB, viA, viB;
  var dx, dy, dz, dd, dn, dp;
  
  geom.lineVertices = [];
  geom.lineNormals = [];
  
  for (var i = 0; i < edges.length; i++) {
    edge = edges[i];
    
    // edge vertex indices
    viA = edge[0];
    viB = edge[1];
    
    // edge vertices
    vA = verts[viA];
    vB = verts[viB];

    // dir
    dx = vB.x - vA.x;
    dy = vB.y - vA.y;
    dz = vB.z - vA.z;
    
    // normalize
    dd = dx*dx + dy*dy + dz*dz;
    // ignore length 0.0 or 1.0
    if(dd !== 1.0 && dd !== 0.0){
      dd = 1.0 / Math.sqrt(dd);
      dx *= dd;
      dy *= dd;
      dz *= dd;
    }
    
    vA = [vA.x, vA.y, vA.z];
    vB = [vB.x, vB.y, vB.z];
    dp = [dx, dy, dz, +1];
    dn = [dx, dy, dz, -1];
    
    geom.lineNormals .push(dp, dn, dp, dp, dn, dn);
    geom.lineVertices.push(vA, vA, vB, vB, vA, vB);
  }
  
};